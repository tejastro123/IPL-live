/*
  # Add more news articles and update points table

  1. Data
    - Add 4 more news articles
    - Update points table to reflect all 6 completed matches

  2. Notes
    - Points recalculated based on match results
*/

INSERT INTO news (title, slug, content, category, image_url, author, is_featured, published_at) VALUES
  ('Yashasvi Jaiswal Shines as Rajasthan Royals Chase Down LSG Total', 'jaiswal-rr-chase-lsg', 'Yashasvi Jaiswal announced his arrival in IPL 2026 with a breathtaking 62 off just 36 balls as Rajasthan Royals comfortably chased down Lucknow Super Giants total of 180 at the Sawai Mansingh Stadium. The young opener smashed 7 fours and 2 sixes in a display of pure batting brilliance that left the LSG bowlers with no answers. Jos Buttler provided solid support with 45 off 30, while Sanju Samson finished things off with an unbeaten 38. For LSG, KL Rahul had scored a fluent 55 and Nicholas Pooran blasted 42 off 22, but it was not enough.', 'match-report', 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', 'Vikram Patel', false, '2026-03-26T18:00:00Z'),

  ('Virat Kohli Blasts 82 as RCB Crush Gujarat Titans by 23 Runs', 'kohli-82-rcb-crush-gt', 'Virat Kohli produced a masterclass in T20 batting with an unbeaten 82 off 52 balls as Royal Challengers Bengaluru posted a massive 205/4 against Gujarat Titans at the M. Chinnaswamy Stadium. Kohli, who hit 9 fours and 3 sixes, was well supported by Glenn Maxwell who smashed 45 off just 22 balls. In reply, GT could only manage 182/8 despite Shubman Gill fighting hard with 48. Mohammed Siraj and Wanindu Hasaranga picked up key wickets to seal a comprehensive victory for RCB.', 'match-report', 'https://images.pexels.com/photos/36314/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', 'Priya Menon', false, '2026-03-27T18:00:00Z'),

  ('IPL 2026 Mid-Season Review: Surprises, Standouts and Storylines', 'ipl-2026-mid-season-review', 'As the IPL 2026 season enters its second week, several storylines have already emerged. Chennai Super Kings and Kolkata Knight Riders have set the early pace with perfect records, while Mumbai Indians and Delhi Capitals are still searching for their first wins. Virat Kohli leads the run-scoring charts with 149 runs, while Rashid Khan has been the standout bowler. The emergence of young talent like Yashasvi Jaiswal and Sai Sudharsan has been one of the highlights. With 30 matches still to play, the tournament is wide open.', 'analysis', 'https://images.pexels.com/photos/16668967/pexels-photo-16668967.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sneha Kapoor', true, '2026-04-20T10:00:00Z'),

  ('Mumbai Indians vs Chennai Super Kings: The El Clasico of IPL Returns', 'mi-vs-csk-el-clasico-preview', 'The greatest rivalry in IPL history resumes as Mumbai Indians host Chennai Super Kings at the Wankhede Stadium. With both teams having rich histories and passionate fan bases, this match always delivers high drama. CSK come into this match on the back of two consecutive wins, while MI will be desperate to open their account. The battle between Rohit Sharma and the CSK spinners could be decisive, while all eyes will be on whether MS Dhoni can produce another trademark finish.', 'analysis', 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', 'Amit Chaudhary', false, '2026-04-25T08:00:00Z');

-- Update points table to reflect all 6 completed matches
UPDATE points_table SET
  matches_played = 2, won = 2, lost = 0, points = 4, net_run_rate = 0.850, recent_form = 'W,W'
WHERE team_id = 'a0000001-0000-0000-0000-000000000001' AND season = 2026;

UPDATE points_table SET
  matches_played = 1, won = 1, lost = 0, points = 2, net_run_rate = 0.350, recent_form = 'W'
WHERE team_id = 'a0000001-0000-0000-0000-000000000004' AND season = 2026;

UPDATE points_table SET
  matches_played = 2, won = 1, lost = 1, points = 2, net_run_rate = 0.420, recent_form = 'L,W'
WHERE team_id = 'a0000001-0000-0000-0000-000000000003' AND season = 2026;

UPDATE points_table SET
  matches_played = 1, won = 1, lost = 0, points = 2, net_run_rate = 0.080, recent_form = 'W'
WHERE team_id = 'a0000001-0000-0000-0000-000000000008' AND season = 2026;

UPDATE points_table SET
  matches_played = 1, won = 1, lost = 0, points = 2, net_run_rate = 0.050, recent_form = 'W'
WHERE team_id = 'a0000001-0000-0000-0000-000000000007' AND season = 2026;

UPDATE points_table SET
  matches_played = 2, won = 1, lost = 1, points = 2, net_run_rate = -0.120, recent_form = 'W,L'
WHERE team_id = 'a0000001-0000-0000-0000-000000000010' AND season = 2026;

UPDATE points_table SET
  matches_played = 1, won = 0, lost = 1, points = 0, net_run_rate = -0.850, recent_form = 'L'
WHERE team_id = 'a0000001-0000-0000-0000-000000000002' AND season = 2026;

UPDATE points_table SET
  matches_played = 1, won = 0, lost = 1, points = 0, net_run_rate = -0.350, recent_form = 'L'
WHERE team_id = 'a0000001-0000-0000-0000-000000000005' AND season = 2026;

UPDATE points_table SET
  matches_played = 1, won = 0, lost = 1, points = 0, net_run_rate = -0.080, recent_form = 'L'
WHERE team_id = 'a0000001-0000-0000-0000-000000000006' AND season = 2026;

UPDATE points_table SET
  matches_played = 1, won = 0, lost = 1, points = 0, net_run_rate = -0.050, recent_form = 'L'
WHERE team_id = 'a0000001-0000-0000-0000-000000000009' AND season = 2026;

-- Recalculate positions
UPDATE points_table SET position = 1 WHERE team_id = 'a0000001-0000-0000-0000-000000000001' AND season = 2026;
UPDATE points_table SET position = 2 WHERE team_id = 'a0000001-0000-0000-0000-000000000004' AND season = 2026;
UPDATE points_table SET position = 3 WHERE team_id = 'a0000001-0000-0000-0000-000000000003' AND season = 2026;
UPDATE points_table SET position = 4 WHERE team_id = 'a0000001-0000-0000-0000-000000000008' AND season = 2026;
UPDATE points_table SET position = 5 WHERE team_id = 'a0000001-0000-0000-0000-000000000007' AND season = 2026;
UPDATE points_table SET position = 6 WHERE team_id = 'a0000001-0000-0000-0000-000000000010' AND season = 2026;
UPDATE points_table SET position = 7 WHERE team_id = 'a0000001-0000-0000-0000-000000000002' AND season = 2026;
UPDATE points_table SET position = 8 WHERE team_id = 'a0000001-0000-0000-0000-000000000005' AND season = 2026;
UPDATE points_table SET position = 9 WHERE team_id = 'a0000001-0000-0000-0000-000000000006' AND season = 2026;
UPDATE points_table SET position = 10 WHERE team_id = 'a0000001-0000-0000-0000-000000000009' AND season = 2026;
