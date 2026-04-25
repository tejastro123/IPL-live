/*
  # Seed points table and news articles

  1. Data
    - Points table entries for all 10 teams based on 6 completed matches
    - 6 news articles covering match reports and analysis

  2. Notes
    - Points calculated: Win = 2pts, Loss = 0, NR = 1
    - NRR values are realistic approximations
*/

INSERT INTO points_table (season, team_id, matches_played, won, lost, tied, no_result, points, net_run_rate, position, recent_form) VALUES
  (2026, 'a0000001-0000-0000-0000-000000000001', 2, 2, 0, 0, 0, 4, 0.850, 1, 'W,W'),
  (2026, 'a0000001-0000-0000-0000-000000000004', 1, 1, 0, 0, 0, 2, 0.350, 2, 'W'),
  (2026, 'a0000001-0000-0000-0000-000000000003', 2, 1, 1, 0, 0, 2, 0.120, 3, 'L,W'),
  (2026, 'a0000001-0000-0000-0000-000000000008', 1, 1, 0, 0, 0, 2, 0.080, 4, 'W'),
  (2026, 'a0000001-0000-0000-0000-000000000007', 1, 1, 0, 0, 0, 2, 0.050, 5, 'W'),
  (2026, 'a0000001-0000-0000-0000-000000000010', 2, 1, 1, 0, 0, 2, -0.020, 6, 'W,L'),
  (2026, 'a0000001-0000-0000-0000-000000000002', 1, 0, 1, 0, 0, 0, -0.850, 7, 'L'),
  (2026, 'a0000001-0000-0000-0000-000000000005', 1, 0, 1, 0, 0, 0, -0.350, 8, 'L'),
  (2026, 'a0000001-0000-0000-0000-000000000006', 1, 0, 1, 0, 0, 0, -0.080, 9, 'L'),
  (2026, 'a0000001-0000-0000-0000-000000000009', 1, 0, 1, 0, 0, 0, -0.050, 10, 'L');

INSERT INTO news (title, slug, content, category, image_url, author, is_featured, published_at) VALUES
  ('CSK Start IPL 2026 Campaign with Dominant Win Over Mumbai Indians', 'csk-start-ipl-2026-dominant-win', 'Chennai Super Kings began their IPL 2026 campaign in style with a comprehensive 6-wicket victory over Mumbai Indians at the M.A. Chidambaram Stadium. Ravindra Jadeja was the star of the show, contributing with both bat and ball as CSK chased down 166 with 9 balls to spare. Devon Conway anchored the chase with a fluent 52 off 38 balls, while Ruturaj Gaikwad provided the early impetus with 46 off 32. For MI, Rohit Sharma top-scored with 48 but lacked support from the middle order. The win marks CSK as early favorites in what promises to be another thrilling IPL season.', 'match-report', 'https://images.pexels.com/photos/16668967/pexels-photo-16668967.jpeg?auto=compress&cs=tinysrgb&w=800', 'Rajesh Sharma', true, '2026-03-22T18:00:00Z'),

  ('Andre Russell Powers KKR to Thrilling Victory Against RCB', 'russell-powers-kkr-thrilling-win', 'Andre Russell produced a breathtaking all-round performance as Kolkata Knight Riders edged past Royal Challengers Bengaluru by 7 runs in a high-scoring thriller at Eden Gardens. Russell smashed an unbeaten 35 off just 18 balls with 3 sixes after claiming 2 wickets with the ball. Virat Kohli had earlier scored a fluent 67 for RCB, but the visitors fell just short in a dramatic final over. Phil Salt set the tone for KKR with a blistering 54 off 32 balls at the top of the order.', 'match-report', 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', 'Priya Menon', false, '2026-03-23T18:00:00Z'),

  ('Travis Head Stars as SRH Chase Down DC Target with Ease', 'head-stars-srh-chase-down-dc', 'Sunrisers Hyderabad made light work of a 176-run target as Travis Head played a scintillating knock to guide his team to a 4-wicket victory over Delhi Capitals. Head smashed boundaries at will and kept the required rate well within reach throughout the chase. Pat Cummins led from the front with the ball, picking up crucial wickets to restrict DC to a below-par total. The win gives SRH early momentum in the tournament.', 'match-report', 'https://images.pexels.com/photos/36314/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', 'Amit Chaudhary', false, '2026-03-24T18:00:00Z'),

  ('Rashid Khan Magic Helps GT Defend Total Against Punjab Kings', 'rashid-khan-gt-defend-pbks', 'Gujarat Titans spinner Rashid Khan weaved his magic with the ball as GT successfully defended their total to beat Punjab Kings by 8 runs at the Narendra Modi Stadium. Rashid picked up 3 crucial wickets and conceded just 18 runs in his 4 overs, strangling the PBKS middle order. Shubman Gill had earlier scored a composed half-century to set up a competitive total. The Afghan leg-spinner was deservedly named Player of the Match.', 'match-report', 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', 'Vikram Patel', false, '2026-03-25T18:00:00Z'),

  ('IPL 2026: Five Young Players to Watch This Season', 'ipl-2026-young-players-watch', 'The Indian Premier League has always been a platform for young talent to shine, and the 2026 season promises to be no different. From Yashasvi Jaiswal''s elegant strokeplay to Matheesha Pathirana''s express pace, this season features an exciting crop of youngsters ready to make their mark. We look at five players under 25 who could be the breakout stars of IPL 2026, including Rinku Singh, Sai Sudharsan, and Noor Ahmad. These players have shown glimpses of their potential and are primed for big performances this season.', 'analysis', 'https://images.pexels.com/photos/16668967/pexels-photo-16668967.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sneha Kapoor', true, '2026-03-26T10:00:00Z'),

  ('RCB End Losing Streak with Commanding Win Over Gujarat Titans', 'rcb-end-streak-win-gt', 'Royal Challengers Bengaluru ended their losing streak in style with a dominant 23-run victory over Gujarat Titans at the M. Chinnaswamy Stadium. Virat Kohli led from the front with a masterful innings, while the bowling attack led by Mohammed Siraj and Wanindu Hasaranga kept GT batters in check throughout the chase. The victory will give RCB immense confidence as they look to build momentum in the early stages of the tournament.', 'match-report', 'https://images.pexels.com/photos/36314/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', 'Rajesh Sharma', false, '2026-03-27T18:00:00Z');
