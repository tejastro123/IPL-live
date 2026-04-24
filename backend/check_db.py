import psycopg2
conn = psycopg2.connect('postgresql://postgres:tejas123@localhost/iplfan')
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
print(cur.fetchall())
conn.close()