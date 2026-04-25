/*
  # Seed IPL 2026 Players

  1. Data
    - Insert players for all 10 teams (approx 8-10 per team)
    - Realistic player names, roles, and styles

  2. Notes
    - Player IDs use predictable UUIDs for reference
    - captain_id references will be set after this migration
*/

INSERT INTO players (id, name, team_id, role, nationality, batting_style, bowling_style, date_of_birth, jersey_number) VALUES
-- CSK
  ('b0000001-0000-0000-0000-000000000001', 'Ruturaj Gaikwad', 'a0000001-0000-0000-0000-000000000001', 'batsman', 'India', 'Right-hand bat', '', '1997-01-31', 31),
  ('b0000001-0000-0000-0000-000000000002', 'Ravindra Jadeja', 'a0000001-0000-0000-0000-000000000001', 'all-rounder', 'India', 'Left-hand bat', 'Left-arm orthodox', '1988-12-06', 8),
  ('b0000001-0000-0000-0000-000000000003', 'MS Dhoni', 'a0000001-0000-0000-0000-000000000001', 'wicket-keeper', 'India', 'Right-hand bat', '', '1981-07-07', 7),
  ('b0000001-0000-0000-0000-000000000004', 'Devon Conway', 'a0000001-0000-0000-0000-000000000001', 'batsman', 'New Zealand', 'Left-hand bat', '', '1991-07-08', 27),
  ('b0000001-0000-0000-0000-000000000005', 'Deepak Chahar', 'a0000001-0000-0000-0000-000000000001', 'bowler', 'India', 'Right-hand bat', 'Right-arm fast-medium', '1992-08-07', 90),
  ('b0000001-0000-0000-0000-000000000006', 'Matheesha Pathirana', 'a0000001-0000-0000-0000-000000000001', 'bowler', 'Sri Lanka', 'Right-hand bat', 'Right-arm fast', '2002-12-12', 34),
  ('b0000001-0000-0000-0000-000000000007', 'Moeen Ali', 'a0000001-0000-0000-0000-000000000001', 'all-rounder', 'England', 'Left-hand bat', 'Right-arm off-break', '1987-06-18', 18),
  ('b0000001-0000-0000-0000-000000000008', 'Tushar Deshpande', 'a0000001-0000-0000-0000-000000000001', 'bowler', 'India', 'Right-hand bat', 'Right-arm fast-medium', '1995-05-12', 20),
  ('b0000001-0000-0000-0000-000000000009', 'Shivam Dube', 'a0000001-0000-0000-0000-000000000001', 'all-rounder', 'India', 'Left-hand bat', 'Right-arm medium', '1993-06-26', 7),
  ('b0000001-0000-0000-0000-000000000010', 'Ajinkya Rahane', 'a0000001-0000-0000-0000-000000000001', 'batsman', 'India', 'Right-hand bat', '', '1988-06-06', 25),

-- MI
  ('b0000002-0000-0000-0000-000000000001', 'Hardik Pandya', 'a0000001-0000-0000-0000-000000000002', 'all-rounder', 'India', 'Left-hand bat', 'Right-arm fast-medium', '1993-10-11', 33),
  ('b0000002-0000-0000-0000-000000000002', 'Rohit Sharma', 'a0000001-0000-0000-0000-000000000002', 'batsman', 'India', 'Right-hand bat', '', '1987-04-30', 45),
  ('b0000002-0000-0000-0000-000000000003', 'Jasprit Bumrah', 'a0000001-0000-0000-0000-000000000002', 'bowler', 'India', 'Right-hand bat', 'Right-arm fast', '1993-12-06', 93),
  ('b0000002-0000-0000-0000-000000000004', 'Suryakumar Yadav', 'a0000001-0000-0000-0000-000000000002', 'batsman', 'India', 'Right-hand bat', '', '1990-09-14', 63),
  ('b0000002-0000-0000-0000-000000000005', 'Ishan Kishan', 'a0000001-0000-0000-0000-000000000002', 'wicket-keeper', 'India', 'Left-hand bat', '', '1998-07-22', 32),
  ('b0000002-0000-0000-0000-000000000006', 'Trent Boult', 'a0000001-0000-0000-0000-000000000002', 'bowler', 'New Zealand', 'Right-hand bat', 'Left-arm fast-medium', '1989-07-22', 18),
  ('b0000002-0000-0000-0000-000000000007', 'Tim David', 'a0000001-0000-0000-0000-000000000002', 'batsman', 'Australia', 'Right-hand bat', '', '1996-03-16', 8),
  ('b0000002-0000-0000-0000-000000000008', 'Piyush Chawla', 'a0000001-0000-0000-0000-000000000002', 'bowler', 'India', 'Right-hand bat', 'Right-arm leg-break', '1988-12-24', 3),
  ('b0000002-0000-0000-0000-000000000009', 'Tilak Varma', 'a0000001-0000-0000-0000-000000000002', 'batsman', 'India', 'Left-hand bat', '', '2002-11-09', 9),

-- RCB
  ('b0000003-0000-0000-0000-000000000001', 'Virat Kohli', 'a0000001-0000-0000-0000-000000000003', 'batsman', 'India', 'Right-hand bat', '', '1988-11-05', 18),
  ('b0000003-0000-0000-0000-000000000002', 'Faf du Plessis', 'a0000001-0000-0000-0000-000000000003', 'batsman', 'South Africa', 'Right-hand bat', '', '1984-07-13', 13),
  ('b0000003-0000-0000-0000-000000000003', 'Glenn Maxwell', 'a0000001-0000-0000-0000-000000000003', 'all-rounder', 'Australia', 'Right-hand bat', 'Right-arm off-break', '1988-10-02', 32),
  ('b0000003-0000-0000-0000-000000000004', 'Mohammed Siraj', 'a0000001-0000-0000-0000-000000000003', 'bowler', 'India', 'Right-hand bat', 'Right-arm fast-medium', '1994-03-13', 73),
  ('b0000003-0000-0000-0000-000000000005', 'Dinesh Karthik', 'a0000001-0000-0000-0000-000000000003', 'wicket-keeper', 'India', 'Right-hand bat', '', '1985-06-01', 21),
  ('b0000003-0000-0000-0000-000000000006', 'Harshal Patel', 'a0000001-0000-0000-0000-000000000003', 'bowler', 'India', 'Right-hand bat', 'Right-arm fast-medium', '1990-11-23', 37),
  ('b0000003-0000-0000-0000-000000000007', 'Wanindu Hasaranga', 'a0000001-0000-0000-0000-000000000003', 'bowler', 'Sri Lanka', 'Right-hand bat', 'Right-arm leg-break', '1997-07-29', 3),
  ('b0000003-0000-0000-0000-000000000008', 'Rajat Patidar', 'a0000001-0000-0000-0000-000000000003', 'batsman', 'India', 'Right-hand bat', '', '1993-06-06', 27),

-- KKR
  ('b0000004-0000-0000-0000-000000000001', 'Shreyas Iyer', 'a0000001-0000-0000-0000-000000000004', 'batsman', 'India', 'Right-hand bat', '', '1994-12-06', 41),
  ('b0000004-0000-0000-0000-000000000002', 'Andre Russell', 'a0000001-0000-0000-0000-000000000004', 'all-rounder', 'West Indies', 'Right-hand bat', 'Right-arm fast', '1988-04-29', 12),
  ('b0000004-0000-0000-0000-000000000003', 'Sunil Narine', 'a0000001-0000-0000-0000-000000000004', 'all-rounder', 'West Indies', 'Left-hand bat', 'Right-arm off-break', '1987-05-26', 17),
  ('b0000004-0000-0000-0000-000000000004', 'Mitchell Starc', 'a0000001-0000-0000-0000-000000000004', 'bowler', 'Australia', 'Left-hand bat', 'Left-arm fast', '1990-01-30', 56),
  ('b0000004-0000-0000-0000-000000000005', 'Phil Salt', 'a0000001-0000-0000-0000-000000000004', 'wicket-keeper', 'England', 'Right-hand bat', '', '1996-08-28', 25),
  ('b0000004-0000-0000-0000-000000000006', 'Varun Chakravarthy', 'a0000001-0000-0000-0000-000000000004', 'bowler', 'India', 'Right-hand bat', 'Right-arm leg-break', '1991-08-26', 29),
  ('b0000004-0000-0000-0000-000000000007', 'Venkatesh Iyer', 'a0000001-0000-0000-0000-000000000004', 'all-rounder', 'India', 'Left-hand bat', 'Right-arm medium', '1994-12-25', 35),
  ('b0000004-0000-0000-0000-000000000008', 'Rinku Singh', 'a0000001-0000-0000-0000-000000000004', 'batsman', 'India', 'Left-hand bat', '', '1997-10-12', 2),

-- DC
  ('b0000005-0000-0000-0000-000000000001', 'Rishabh Pant', 'a0000001-0000-0000-0000-000000000005', 'wicket-keeper', 'India', 'Left-hand bat', '', '1997-10-04', 17),
  ('b0000005-0000-0000-0000-000000000002', 'David Warner', 'a0000001-0000-0000-0000-000000000005', 'batsman', 'Australia', 'Left-hand bat', '', '1986-10-27', 31),
  ('b0000005-0000-0000-0000-000000000003', 'Axar Patel', 'a0000001-0000-0000-0000-000000000005', 'all-rounder', 'India', 'Left-hand bat', 'Left-arm orthodox', '1994-01-20', 20),
  ('b0000005-0000-0000-0000-000000000004', 'Kuldeep Yadav', 'a0000001-0000-0000-0000-000000000005', 'bowler', 'India', 'Left-hand bat', 'Left-arm wrist-spin', '1994-12-14', 23),
  ('b0000005-0000-0000-0000-000000000005', 'Anrich Nortje', 'a0000001-0000-0000-0000-000000000005', 'bowler', 'South Africa', 'Right-hand bat', 'Right-arm fast', '1994-03-15', 62),
  ('b0000005-0000-0000-0000-000000000006', 'Prithvi Shaw', 'a0000001-0000-0000-0000-000000000005', 'batsman', 'India', 'Right-hand bat', '', '1999-11-09', 100),
  ('b0000005-0000-0000-0000-000000000007', 'Khaleel Ahmed', 'a0000001-0000-0000-0000-000000000005', 'bowler', 'India', 'Left-hand bat', 'Left-arm fast-medium', '1997-09-11', 43),

-- PBKS
  ('b0000006-0000-0000-0000-000000000001', 'Shikhar Dhawan', 'a0000001-0000-0000-0000-000000000006', 'batsman', 'India', 'Left-hand bat', '', '1985-12-05', 42),
  ('b0000006-0000-0000-0000-000000000002', 'Sam Curran', 'a0000001-0000-0000-0000-000000000006', 'all-rounder', 'England', 'Left-hand bat', 'Left-arm medium-fast', '1998-06-03', 58),
  ('b0000006-0000-0000-0000-000000000003', 'Arshdeep Singh', 'a0000001-0000-0000-0000-000000000006', 'bowler', 'India', 'Left-hand bat', 'Left-arm medium-fast', '1999-02-05', 2),
  ('b0000006-0000-0000-0000-000000000004', 'Liam Livingstone', 'a0000001-0000-0000-0000-000000000006', 'all-rounder', 'England', 'Right-hand bat', 'Right-arm off-break', '1993-08-04', 7),
  ('b0000006-0000-0000-0000-000000000005', 'Jitesh Sharma', 'a0000001-0000-0000-0000-000000000006', 'wicket-keeper', 'India', 'Right-hand bat', '', '1993-11-05', 28),
  ('b0000006-0000-0000-0000-000000000006', 'Kagiso Rabada', 'a0000001-0000-0000-0000-000000000006', 'bowler', 'South Africa', 'Right-hand bat', 'Right-arm fast', '1995-05-25', 25),
  ('b0000006-0000-0000-0000-000000000007', 'Harpreet Brar', 'a0000001-0000-0000-0000-000000000006', 'all-rounder', 'India', 'Left-hand bat', 'Left-arm orthodox', '1995-09-08', 37),

-- RR
  ('b0000007-0000-0000-0000-000000000001', 'Sanju Samson', 'a0000001-0000-0000-0000-000000000007', 'wicket-keeper', 'India', 'Right-hand bat', '', '1994-11-06', 9),
  ('b0000007-0000-0000-0000-000000000002', 'Jos Buttler', 'a0000001-0000-0000-0000-000000000007', 'batsman', 'England', 'Right-hand bat', '', '1990-09-08', 63),
  ('b0000007-0000-0000-0000-000000000003', 'Yashasvi Jaiswal', 'a0000001-0000-0000-0000-000000000007', 'batsman', 'India', 'Left-hand bat', '', '2001-12-28', 13),
  ('b0000007-0000-0000-0000-000000000004', 'Ravichandran Ashwin', 'a0000001-0000-0000-0000-000000000007', 'all-rounder', 'India', 'Right-hand bat', 'Right-arm off-break', '1986-09-17', 99),
  ('b0000007-0000-0000-0000-000000000005', 'Trent Boult', 'a0000001-0000-0000-0000-000000000007', 'bowler', 'New Zealand', 'Right-hand bat', 'Left-arm fast-medium', '1989-07-22', 18),
  ('b0000007-0000-0000-0000-000000000006', 'Yuzvendra Chahal', 'a0000001-0000-0000-0000-000000000007', 'bowler', 'India', 'Right-hand bat', 'Right-arm leg-break', '1990-07-23', 3),
  ('b0000007-0000-0000-0000-000000000007', 'Shimron Hetmyer', 'a0000001-0000-0000-0000-000000000007', 'batsman', 'West Indies', 'Left-hand bat', '', '1996-12-22', 15),

-- SRH
  ('b0000008-0000-0000-0000-000000000001', 'Pat Cummins', 'a0000001-0000-0000-0000-000000000008', 'all-rounder', 'Australia', 'Right-hand bat', 'Right-arm fast', '1993-05-08', 30),
  ('b0000008-0000-0000-0000-000000000002', 'Aiden Markram', 'a0000001-0000-0000-0000-000000000008', 'batsman', 'South Africa', 'Right-hand bat', '', '1994-10-04', 11),
  ('b0000008-0000-0000-0000-000000000003', 'Travis Head', 'a0000001-0000-0000-0000-000000000008', 'batsman', 'Australia', 'Left-hand bat', 'Right-arm off-break', '1994-01-15', 66),
  ('b0000008-0000-0000-0000-000000000004', 'Bhuvneshwar Kumar', 'a0000001-0000-0000-0000-000000000008', 'bowler', 'India', 'Right-hand bat', 'Right-arm medium-fast', '1990-02-05', 15),
  ('b0000008-0000-0000-0000-000000000005', 'Abdul Samad', 'a0000001-0000-0000-0000-000000000008', 'batsman', 'India', 'Right-hand bat', '', '2001-10-04', 4),
  ('b0000008-0000-0000-0000-000000000006', 'Umran Malik', 'a0000001-0000-0000-0000-000000000008', 'bowler', 'India', 'Right-hand bat', 'Right-arm fast', '1999-11-22', 24),
  ('b0000008-0000-0000-0000-000000000007', 'Heinrich Klaasen', 'a0000001-0000-0000-0000-000000000008', 'wicket-keeper', 'South Africa', 'Right-hand bat', '', '1992-07-30', 81),

-- LSG
  ('b0000009-0000-0000-0000-000000000001', 'KL Rahul', 'a0000001-0000-0000-0000-000000000009', 'batsman', 'India', 'Right-hand bat', '', '1992-04-27', 1),
  ('b0000009-0000-0000-0000-000000000002', 'Quinton de Kock', 'a0000001-0000-0000-0000-000000000009', 'wicket-keeper', 'South Africa', 'Left-hand bat', '', '1992-12-17', 12),
  ('b0000009-0000-0000-0000-000000000003', 'Marcus Stoinis', 'a0000001-0000-0000-0000-000000000009', 'all-rounder', 'Australia', 'Right-hand bat', 'Right-arm medium', '1989-08-16', 9),
  ('b0000009-0000-0000-0000-000000000004', 'Krunal Pandya', 'a0000001-0000-0000-0000-000000000009', 'all-rounder', 'India', 'Left-hand bat', 'Left-arm orthodox', '1991-03-24', 24),
  ('b0000009-0000-0000-0000-000000000005', 'Ravi Bishnoi', 'a0000001-0000-0000-0000-000000000009', 'bowler', 'India', 'Right-hand bat', 'Right-arm leg-break', '2000-09-05', 9),
  ('b0000009-0000-0000-0000-000000000006', 'Avesh Khan', 'a0000001-0000-0000-0000-000000000009', 'bowler', 'India', 'Right-hand bat', 'Right-arm fast-medium', '1996-12-15', 27),
  ('b0000009-0000-0000-0000-000000000007', 'Nicholas Pooran', 'a0000001-0000-0000-0000-000000000009', 'batsman', 'West Indies', 'Left-hand bat', '', '1995-10-02', 42),

-- GT
  ('b0000010-0000-0000-0000-000000000001', 'Shubman Gill', 'a0000001-0000-0000-0000-000000000010', 'batsman', 'India', 'Right-hand bat', '', '1999-09-08', 77),
  ('b0000010-0000-0000-0000-000000000002', 'Rashid Khan', 'a0000001-0000-0000-0000-000000000010', 'all-rounder', 'Afghanistan', 'Right-hand bat', 'Right-arm leg-break', '1998-09-20', 18),
  ('b0000010-0000-0000-0000-000000000003', 'David Miller', 'a0000001-0000-0000-0000-000000000010', 'batsman', 'South Africa', 'Left-hand bat', '', '1989-11-14', 10),
  ('b0000010-0000-0000-0000-000000000004', 'Mohammed Shami', 'a0000001-0000-0000-0000-000000000010', 'bowler', 'India', 'Right-hand bat', 'Right-arm fast-medium', '1990-09-03', 11),
  ('b0000010-0000-0000-0000-000000000005', 'Wriddhiman Saha', 'a0000001-0000-0000-0000-000000000010', 'wicket-keeper', 'India', 'Right-hand bat', '', '1984-10-24', 6),
  ('b0000010-0000-0000-0000-000000000006', 'Hardik Pandya', 'a0000001-0000-0000-0000-000000000010', 'all-rounder', 'India', 'Right-hand bat', 'Right-arm fast-medium', '1993-10-11', 33),
  ('b0000010-0000-0000-0000-000000000007', 'Noor Ahmad', 'a0000001-0000-0000-0000-000000000010', 'bowler', 'Afghanistan', 'Left-hand bat', 'Left-arm wrist-spin', '2004-01-03', 11),
  ('b0000010-0000-0000-0000-000000000008', 'Sai Sudharsan', 'a0000001-0000-0000-0000-000000000010', 'batsman', 'India', 'Left-hand bat', '', '2001-10-15', 22);
