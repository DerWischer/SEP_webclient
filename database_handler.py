import MySQLdb
 
def create_database():
	'''create octoprint if not exists'''
	db1 = MySQLdb.connect(host="localhost",   user="root",  passwd="root") 
	cursor = db1.cursor()
	sql = 'CREATE DATABASE IF NOT EXISTS octoprint'  
	cursor.execute(sql)

def create_database_tables():
	db1 = get_database()
	sql = 'USE octoprint'
	cursor.execute(sql)
	sql =  'CREATE TABLE if not exists customer(customer_id varchar(10) PRIMARY KEY, name varchar(25)) ;'
	cursor.execute(sql)            
	sql =  'CREATE TABLE if not exists cad(project_id varchar(10) PRIMARY KEY, id int(36) NOT NULL, customer_id varchar(10), prtfile varchar(1000), info varbinary(5000),FOREIGN KEY (customer_id) REFERENCES customer(customer_id))'
	cursor.execute(sql)  
	sql =  'CREATE TABLE if not exists details(detailed_id varchar(10) PRIMARY KEY ,id int(36) UNIQUE KEY,stlfile varchar(1000) ,project_id varchar(10), FOREIGN KEY (project_id) REFERENCES cad(project_id))'
	cursor.execute(sql)
	sql =  'CREATE TABLE if not exists material(material_id varchar(10) PRIMARY KEY,id int(36) UNIQUE KEY, materialpic varbinary(5000))'
	cursor.execute(sql) 
	sql =  'CREATE TABLE if not exists material_measurement(material_id varchar(10) ,id int(36) UNIQUE KEY,measurement varbinary(5000),FOREIGN KEY (material_id) REFERENCES  material(material_id)) '
	cursor.execute(sql) 
	sql =  'CREATE TABLE if not exists build(build_id varchar(10) PRIMARY KEY,id int(36) UNIQUE KEY, material_id varchar(10), build_image varbinary(5000),partnum int(11),printing_param varchar(500) ,info varbinary(5000),deleted bit(1) , FOREIGN KEY (material_id) REFERENCES material(material_id))'
	cursor.execute(sql) 
	sql =  'CREATE TABLE if not exists preprint(build_id varchar(10) ,detailed_id varchar(10), FOREIGN KEY (build_id) REFERENCES build(build_id), FOREIGN KEY (detailed_id) REFERENCES details(detailed_id))'
	cursor.execute(sql)
	sql =  'CREATE TABLE if not exists printing(slm_id varchar(10) PRIMARY KEY ,id int(36) UNIQUE KEY,build_id varchar(10),build_file varchar(1000) ,starttime date DEFAULT NULL,enddate date DEFAULT NULL,operator date DEFAULT NULL,machinetype varchar(10) ,powderweightstart varchar(10) ,powderweightend varchar(10) ,powderwasteweight varchar(10) ,powderused varchar(10) ,buildmaterial varchar(10) ,buildweight varchar(10) ,calcprinttime varchar(10) ,powdercondition varchar(10) ,layernumber int(11) DEFAULT NULL,dpcfactor int(11) DEFAULT NULL,minexptime varchar(10) ,comments varchar(200),FOREIGN KEY (build_id) REFERENCES build(build_id))'
	cursor.execute(sql) 
	sql =  'CREATE TABLE if not exists postprint(slm_id varchar(10),printedimage varbinary(5000) DEFAULT NULL,supportremoval bit(1) DEFAULT NULL,wedm bit(1) DEFAULT NULL,wedemcomment varchar(100) ,balsting bit(1) DEFAULT NULL,blastingtype varchar(50) ,blastingcomment varchar(100) ,stresstemp varchar(10) ,stresstime varchar(10) ,stressshieldinggas bit(1) DEFAULT NULL,stresscomment varchar(100) ,hardeningtemp varchar(10) ,hardningtime varchar(10) ,hardeningcomment varchar(100) ,temperingtemp varchar(10) ,temperingtime varchar(10) ,temperingcycles varchar(10) ,temperingcomment varchar(100) ,solutiontemp varchar(10) , solutiontime varchar(10) ,solutioncomment varchar(100) ,agingtemp varchar(10) ,agingtime varchar(10) ,agingcycles varchar(10) ,agingcomment varchar(100),  FOREIGN KEY (slm_id) REFERENCES printing(slm_id))'
	cursor.execute(sql)
	sql =  'CREATE TABLE if not exists users(user_id varchar(10) PRIMARY KEY ,name varchar(25) ,password varchar(10) ,access_type varchar(10) ,deleted bit(1),information varbinary(5000))'
	cursor.execute(sql)
	sql =  'CREATE TABLE  if not exists userfiles (user_id varchar(10),detailed_id varchar(10),slm_id varchar(10) ,build_id varchar(10) ,type varchar(10) ,  FOREIGN KEY (user_id) REFERENCES users(user_id), FOREIGN KEY (detailed_id) REFERENCES details(detailed_id) , FOREIGN KEY (build_id) REFERENCES build(build_id), FOREIGN KEY (slm_id) REFERENCES printing(slm_id))'
	cursor.execute(sql) 
	sql =  'CREATE TABLE  if not exists log (user_id varchar(10),login date DEFAULT NULL,logout date DEFAULT NULL,file_accessed varchar(1000),FOREIGN KEY (user_id) REFERENCES users(user_id) )'
	cursor.execute(sql)
	sql = 'CREATE TABLE if not exists filesystem (id varchar(36) PRIMARY KEY, filename varchar(250), path varchar(1000), file_ext varchar(10), hashvalue varchar(128), size int, created int, updated int)'
	cursor.execute(sql)

def get_database():
	try:
		return MySQLdb.connect(host="localhost",   user="root",  passwd="root", db="octoprint")
	except:
		print ("Warning: could not connect to database, maybe it is not created yet?")
	
def test_database_1():
	db = get_database() 
	cur = db.cursor() 
	cur.execute("SELECT * FROM users")
	# print the first and second columns      
	for row in cur.fetchall() :
		print(row[0], " ", row[1])
		
def file_entry(id, name, path, ext, hashValue, size, created, updated):
	db = get_database()
	cur = db.cursor()
	sql = ('INSERT INTO filesystem VALUES ("%s", "%s", "%s", "%s", "%s", %s, %s, %s)' % (id, name, path, ext, hashValue, size, created, updated))
	cur.execute(sql)
	cur.close()
	db.commit()
	        
