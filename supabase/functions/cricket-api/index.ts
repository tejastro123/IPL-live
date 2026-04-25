import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CRICBUZZ_BASE = "https://www.cricbuzz.com";
const CRICBUZZ_MAPP = "https://mapps.cricbuzz.com/cbzios/match";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/html, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

async function fetchJSON(url: string): Promise<any> {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchHTML(url: string): Promise<string | null> {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  try {
    return await res.text();
  } catch {
    return null;
  }
}

function extractJSONFromHTML(html: string, varName: string): any {
  const patterns = [
    new RegExp(`window\\.${varName}\\s*=\\s*({[\\s\\S]*?});`, "m"),
    new RegExp(`var ${varName}\\s*=\\s*({[\\s\\S]*?});`, "m"),
    new RegExp(`"${varName}"\\s*:\\s*({[\\s\\S]*?})\\s*[,;]`, "m"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch {
        continue;
      }
    }
  }

  // Try finding JSON by bracket depth counting
  const searchStr = `"${varName}"`;
  const idx = html.indexOf(searchStr);
  if (idx !== -1) {
    const startIdx = html.indexOf("{", idx);
    if (startIdx !== -1) {
      let depth = 0;
      let endIdx = startIdx;
      for (let i = startIdx; i < html.length; i++) {
        if (html[i] === "{") depth++;
        if (html[i] === "}") depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
      try {
        return JSON.parse(html.substring(startIdx, endIdx));
      } catch {
        // fall through
      }
    }
  }

  return null;
}

// Map Cricbuzz team names to IPL short codes
const TEAM_MAP: Record<string, string> = {
  "Chennai Super Kings": "CSK",
  "Mumbai Indians": "MI",
  "Royal Challengers Bengaluru": "RCB",
  "Royal Challengers Bangalore": "RCB",
  "Kolkata Knight Riders": "KKR",
  "Delhi Capitals": "DC",
  "Punjab Kings": "PBKS",
  "Rajasthan Royals": "RR",
  "Sunrisers Hyderabad": "SRH",
  "Lucknow Super Giants": "LSG",
  "Gujarat Titans": "GT",
};

function isIPLMatch(data: any): boolean {
  const seriesName = data?.series_name || data?.seriesName || data?.srs || "";
  const matchTitle = data?.match_desc || data?.name || data?.title || "";
  const team1 = data?.team1?.name || data?.team1_name || "";
  const team2 = data?.team2?.name || data?.team2_name || "";

  const iplKeywords = ["ipl", "indian premier league", "indian t20 league"];
  const check = (s: string) =>
    iplKeywords.some((k) => s.toLowerCase().includes(k));

  return (
    check(seriesName) ||
    check(matchTitle) ||
    check(team1) ||
    check(team2) ||
    Object.keys(TEAM_MAP).some(
      (name) => team1.includes(name) || team2.includes(name)
    )
  );
}

function normalizeLiveMatch(match: any): any {
  const team1Name = match.team1?.name || "";
  const team2Name = match.team2?.name || "";
  const team1Short = TEAM_MAP[team1Name] || match.team1?.sName || "";
  const team2Short = TEAM_MAP[team2Name] || match.team2?.sName || "";

  const scores: any[] = [];

  // Extract scores from bat_team/bow_team (live format)
  if (match.bat_team?.innings) {
    for (const inn of match.bat_team.innings) {
      scores.push({
        inning: `${team1Short} Innings ${inn.id}`,
        r: parseInt(inn.score) || 0,
        w: parseInt(inn.wkts) || 0,
        o: parseFloat(inn.overs) || 0,
        team: team1Short,
      });
    }
  }
  if (match.bow_team?.innings) {
    for (const inn of match.bow_team.innings) {
      scores.push({
        inning: `${team2Short} Innings ${inn.id}`,
        r: parseInt(inn.score) || 0,
        w: parseInt(inn.wkts) || 0,
        o: parseFloat(inn.overs) || 0,
        team: team2Short,
      });
    }
  }

  // Also try score field format
  if (match.score && Array.isArray(match.score)) {
    for (const s of match.score) {
      scores.push({
        inning: s.inning || "",
        r: s.r || s.runs || 0,
        w: s.w || s.wkts || 0,
        o: s.o || s.overs || 0,
        team: s.team || "",
      });
    }
  }

  const header = match.header || {};
  const state = header.state || match.matchState || "";
  const status = header.status || match.status || "";

  let matchStatus: string;
  if (
    state.toLowerCase().includes("live") ||
    state.toLowerCase().includes("in progress")
  ) {
    matchStatus = "live";
  } else if (
    state.toLowerCase().includes("complete") ||
    state.toLowerCase().includes("result") ||
    status.toLowerCase().includes("won") ||
    status.toLowerCase().includes("win")
  ) {
    matchStatus = "completed";
  } else {
    matchStatus = "upcoming";
  }

  return {
    id: match.match_id || match.id || "",
    name: `${team1Short} vs ${team2Short}`,
    matchType: header.type || match.match_fmt || "T20",
    status: matchStatus,
    live_status: status,
    venue: match.venue?.name || match.venue_name || "",
    date: header.start_time
      ? new Date(parseInt(header.start_time) * 1000).toISOString()
      : match.date || "",
    teams: [team1Name, team2Name],
    teamInfo: [
      { name: team1Name, shortname: team1Short, img: match.team1?.img || "" },
      { name: team2Name, shortname: team2Short, img: match.team2?.img || "" },
    ],
    score: scores,
    series_id: match.series_id || "",
    series_name: match.series_name || header.series_name || "",
    source: "cricbuzz",
  };
}

function normalizeScorecard(data: any, matchId: string): any {
  const innings = data?.Innings || [];
  const scorecardInnings: any[] = [];

  for (const inn of innings) {
    const batTeamName = inn.bat_team_name || "";
    const bowlTeamName =
      data?.team1?.name === batTeamName
        ? data?.team2?.name || ""
        : data?.team1?.name || "";

    const batsmen = (inn.batsmen || []).map((b: any) => ({
      name: b.name || b.bat_name || "",
      runs: parseInt(b.r) || 0,
      balls: parseInt(b.b) || 0,
      fours: parseInt(b["4s"]) || 0,
      sixes: parseInt(b["6s"]) || 0,
      strike_rate: b.sr ? parseFloat(b.sr) : 0,
      dismissal: b.out_desc || b.dismissal || "",
    }));

    const bowlers = (inn.bowlers || []).map((b: any) => ({
      name: b.name || b.bowl_name || "",
      overs: parseFloat(b.o) || 0,
      maidens: parseInt(b.m) || 0,
      runs: parseInt(b.r) || 0,
      wickets: parseInt(b.w) || 0,
      economy: b.econ ? parseFloat(b.econ) : 0,
      wides: parseInt(b.wd) || 0,
      noballs: parseInt(b.n) || 0,
    }));

    const fow = (inn.fow || []).map((f: any) => ({
      name: f.name || "",
      wicket_number: parseInt(f.wkt_nbr) || 0,
      score: parseInt(f.score) || 0,
      overs: f.over || "0",
    }));

    const extras = inn.extras || {};
    scorecardInnings.push({
      innings_id: inn.innings_id || 0,
      bat_team_name: batTeamName,
      bat_team_short: TEAM_MAP[batTeamName] || batTeamName,
      bowl_team_name: bowlTeamName,
      bowl_team_short: TEAM_MAP[bowlTeamName] || bowlTeamName,
      score: parseInt(inn.score) || 0,
      wkts: parseInt(inn.wkts) || 0,
      overs: inn.ovr || "0",
      extras: {
        total: parseInt(extras.t) || 0,
        byes: parseInt(extras.b) || 0,
        leg_byes: parseInt(extras.lb) || 0,
        wides: parseInt(extras.wd) || 0,
        noballs: parseInt(extras.nb) || 0,
        penalty: parseInt(extras.p) || 0,
      },
      batsmen,
      bowlers,
      fall_of_wickets: fow,
    });
  }

  const header = data?.header || {};
  const team1Name = data?.team1?.name || "";
  const team2Name = data?.team2?.name || "";
  const team1Short = TEAM_MAP[team1Name] || data?.team1?.sName || "";
  const team2Short = TEAM_MAP[team2Name] || data?.team2?.sName || "";

  const scores: any[] = [];
  for (const inn of scorecardInnings) {
    scores.push({
      inning: `${inn.bat_team_short} Innings ${inn.innings_id}`,
      r: inn.score,
      w: inn.wkts,
      o: parseFloat(inn.overs) || 0,
      team: inn.bat_team_short,
    });
  }

  return {
    id: matchId,
    name: `${team1Short} vs ${team2Short}`,
    matchType: header.type || "T20",
    status:
      header.state?.toLowerCase().includes("complete") ||
      header.state?.toLowerCase().includes("result")
        ? "completed"
        : header.state?.toLowerCase().includes("live")
          ? "live"
          : "upcoming",
    venue: data?.venue?.name || "",
    date: header.start_time
      ? new Date(parseInt(header.start_time) * 1000).toISOString()
      : "",
    teams: [team1Name, team2Name],
    teamInfo: [
      { name: team1Name, shortname: team1Short, img: data?.team1?.img || "" },
      { name: team2Name, shortname: team2Short, img: data?.team2?.img || "" },
    ],
    score: scores,
    scorecard: scorecardInnings,
    toss: header.toss || "",
    result: header.status || "",
    manOfMatch: data?.man_of_the_match?.name || "",
    source: "cricbuzz",
  };
}

function normalizeCommentary(data: any): any[] {
  const commLines = data?.comm_lines || [];
  const commentary: any[] = [];

  for (const c of commLines) {
    if (c.comm) {
      commentary.push({
        over: c.o_no || "0",
        text: c.comm,
        timestamp: c.timestamp || "",
      });
    }
  }

  return commentary;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint") || "";
    const id = url.searchParams.get("id") || "";

    let result: any = null;

    switch (endpoint) {
      case "live_matches": {
        // Try mapps endpoint first
        const data = await fetchJSON(`${CRICBUZZ_MAPP}/livematches`);
        if (data?.matches) {
          const matches = data.matches
            .filter((m: any) => isIPLMatch(m))
            .map((m: any) => normalizeLiveMatch(m));
          result = { data: matches, source: "cricbuzz_mapps" };
        } else {
          // Fallback: scrape the Cricbuzz live scores page
          const html = await fetchHTML(`${CRICBUZZ_BASE}/live-cricket-scores`);
          if (html) {
            const pageData = extractJSONFromHTML(html, "matchSchedule");
            if (pageData?.matchSchedule) {
              const matches: any[] = [];
              for (const day of pageData.matchSchedule) {
                for (const m of day.matchInfo || []) {
                  if (isIPLMatch(m)) {
                    matches.push(normalizeLiveMatch(m));
                  }
                }
              }
              result = { data: matches, source: "cricbuzz_web" };
            }
          }
        }
        break;
      }

      case "match_info": {
        if (!id) {
          result = { error: "Match ID required" };
          break;
        }
        const data = await fetchJSON(`${CRICBUZZ_MAPP}/${id}`);
        if (data) {
          result = { data: normalizeLiveMatch(data), source: "cricbuzz" };
        }
        break;
      }

      case "match_scorecard": {
        if (!id) {
          result = { error: "Match ID required" };
          break;
        }
        // Try mapps scorecard endpoint
        const scData = await fetchJSON(
          `${CRICBUZZ_MAPP}/${id}/scorecard.json`
        );
        if (scData?.Innings) {
          result = {
            data: normalizeScorecard(scData, id),
            source: "cricbuzz_mapps",
          };
        } else {
          // Fallback: scrape the scorecard page
          const html = await fetchHTML(
            `${CRICBUZZ_BASE}/live-cricket-scorecard/${id}`
          );
          if (html) {
            const pageData = extractJSONFromHTML(html, "scorecardApiData");
            if (pageData) {
              result = {
                data: normalizeScorecard(pageData, id),
                source: "cricbuzz_web",
              };
            }
          }
        }
        break;
      }

      case "match_commentary": {
        if (!id) {
          result = { error: "Match ID required" };
          break;
        }
        const inningsId = url.searchParams.get("innings_id") || "1";
        const commData = await fetchJSON(
          `${CRICBUZZ_BASE}/api/mcenter/${id}/full-commentary/${inningsId}`
        );
        if (commData) {
          const commentary = normalizeCommentary(commData);
          result = { data: commentary, source: "cricbuzz" };
        } else {
          // Fallback: try commentary endpoint
          const commData2 = await fetchJSON(
            `${CRICBUZZ_MAPP}/${id}/commentary`
          );
          if (commData2) {
            result = {
              data: normalizeCommentary(commData2),
              source: "cricbuzz_mapps",
            };
          }
        }
        break;
      }

      case "match_highlights": {
        if (!id) {
          result = { error: "Match ID required" };
          break;
        }
        const inningsId = url.searchParams.get("innings_id") || "1";
        const hlData = await fetchJSON(
          `${CRICBUZZ_BASE}/api/mcenter/highlights/${id}/${inningsId}`
        );
        if (hlData) {
          result = { data: hlData, source: "cricbuzz" };
        }
        break;
      }

      case "ipl_schedule": {
        // Scrape IPL schedule page
        const html = await fetchHTML(
          `${CRICBUZZ_BASE}/cricket-series/ipl-2026/matches`
        );
        if (html) {
          const pageData = extractJSONFromHTML(html, "matchSchedule");
          if (pageData?.matchSchedule) {
            const matches: any[] = [];
            for (const day of pageData.matchSchedule) {
              for (const m of day.matchInfo || []) {
                if (isIPLMatch(m)) {
                  matches.push(normalizeLiveMatch(m));
                }
              }
            }
            result = { data: matches, source: "cricbuzz_web" };
          }
        }
        break;
      }

      default:
        result = {
          error: "Invalid endpoint",
          available_endpoints: [
            "live_matches",
            "match_info",
            "match_scorecard",
            "match_commentary",
            "match_highlights",
            "ipl_schedule",
          ],
        };
    }

    return new Response(JSON.stringify(result || { data: null }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
