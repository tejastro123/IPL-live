/*
  # Seed IPL 2026 Teams

  1. Data
    - Insert all 10 IPL teams with full details
    - Teams: CSK, MI, RCB, KKR, DC, PBKS, RR, SRH, LSG, GT

  2. Notes
    - captain_id will be updated after players are inserted
    - Logo URLs use placeholder paths
*/

INSERT INTO teams (id, name, short_name, city, color_primary, color_secondary, home_venue, owner, coach_name, titles_won, seasons_played) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Chennai Super Kings', 'CSK', 'Chennai', '#FCCA06', '#1C1C1C', 'M.A. Chidambaram Stadium', 'Chennai Super Kings Cricket Ltd.', 'Stephen Fleming', 5, 14),
  ('a0000001-0000-0000-0000-000000000002', 'Mumbai Indians', 'MI', 'Mumbai', '#004BA0', '#D4A843', 'Wankhede Stadium', 'Reliance Industries', 'Mahela Jayawardene', 5, 15),
  ('a0000001-0000-0000-0000-000000000003', 'Royal Challengers Bengaluru', 'RCB', 'Bengaluru', '#D4213D', '#000000', 'M. Chinnaswamy Stadium', 'United Spirits', 'Andy Flower', 0, 15),
  ('a0000001-0000-0000-0000-000000000004', 'Kolkata Knight Riders', 'KKR', 'Kolkata', '#3A225D', '#B3A34A', 'Eden Gardens', 'Red Chillies Entertainment', 'Chandrakant Pandit', 3, 15),
  ('a0000001-0000-0000-0000-000000000005', 'Delhi Capitals', 'DC', 'Delhi', '#004C93', '#EF1C25', 'Arun Jaitley Stadium', 'GMR Group & JSW Group', 'Ricky Ponting', 0, 15),
  ('a0000001-0000-0000-0000-000000000006', 'Punjab Kings', 'PBKS', 'Mohali', '#DD1F2D', '#EDD59E', 'PCA Stadium', 'Mohit Burman & Preity Zinta', 'Trevor Bayliss', 0, 15),
  ('a0000001-0000-0000-0000-000000000007', 'Rajasthan Royals', 'RR', 'Jaipur', '#EA1A85', '#1C1C7E', 'Sawai Mansingh Stadium', 'Emerging Media', 'Kumar Sangakkara', 1, 15),
  ('a0000001-0000-0000-0000-000000000008', 'Sunrisers Hyderabad', 'SRH', 'Hyderabad', '#F26522', '#FCEA09', 'Rajiv Gandhi Stadium', 'Sun TV Network', 'Daniel Vettori', 1, 11),
  ('a0000001-0000-0000-0000-000000000009', 'Lucknow Super Giants', 'LSG', 'Lucknow', '#A72056', '#1D4D2C', 'Ekana Cricket Stadium', 'RPSG Group', 'Justin Langer', 0, 3),
  ('a0000001-0000-0000-0000-000000000010', 'Gujarat Titans', 'GT', 'Ahmedabad', '#1B2133', '#F9C8D5', 'Narendra Modi Stadium', 'Adani Group', 'Ashish Nehra', 1, 3);
