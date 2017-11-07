import MySQLdb
 
db1 = MySQLdb.connect(host="localhost",user="root",passwd="root")

### create octoprint if not exists 
cursor = db1.cursor()
sql = 'create database IF NOT EXISTS octoprint'  
cursor.execute(sql) 


sql =  'CREATE TABLE if not exists octoprint.customer(customer_id varchar(10) PRIMARY KEY, name varchar(25)) ;'
cursor.execute(sql)            
sql =  'CREATE TABLE if not exists octoprint.cad(project_id varchar(10) PRIMARY KEY, id int(36) NOT NULL, customer_id varchar(10), prtfile varchar(1000), info varbinary(5000),FOREIGN KEY (customer_id) REFERENCES octoprint.customer(customer_id))'
cursor.execute(sql)  
sql =  'CREATE TABLE if not exists octoprint.details(detailed_id varchar(10) PRIMARY KEY ,id int(36) UNIQUE KEY,stlfile varchar(1000) ,project_id varchar(10), FOREIGN KEY (project_id) REFERENCES octoprint.cad(project_id))'
cursor.execute(sql)
sql =  'CREATE TABLE if not exists octoprint.material(material_id varchar(10) PRIMARY KEY,id int(36) UNIQUE KEY, materialpic varbinary(5000))'
cursor.execute(sql) 
sql =  'CREATE TABLE if not exists octoprint.material_measurement(material_id varchar(10) ,id int(36) UNIQUE KEY,measurement varbinary(5000),FOREIGN KEY (material_id) REFERENCES  octoprint.material(material_id)) '
cursor.execute(sql) 
sql =  'CREATE TABLE if not exists octoprint.build(build_id varchar(10) PRIMARY KEY,id int(36) UNIQUE KEY, material_id varchar(10), build_image varbinary(5000),partnum int(11),printing_param varchar(500) ,info varbinary(5000),deleted bit(1) , FOREIGN KEY (material_id) REFERENCES octoprint.material(material_id))'
cursor.execute(sql) 
sql =  'CREATE TABLE if not exists octoprint.preprint(build_id varchar(10) ,detailed_id varchar(10), FOREIGN KEY (build_id) REFERENCES octoprint.build(build_id), FOREIGN KEY (detailed_id) REFERENCES octoprint.details(detailed_id))'
cursor.execute(sql)
sql =  'CREATE TABLE if not exists octoprint.printing(slm_id varchar(10) PRIMARY KEY ,id int(36) UNIQUE KEY,build_id varchar(10),build_file varchar(1000) ,starttime date DEFAULT NULL,enddate date DEFAULT NULL,operator date DEFAULT NULL,machinetype varchar(10) ,powderweightstart varchar(10) ,powderweightend varchar(10) ,powderwasteweight varchar(10) ,powderused varchar(10) ,buildmaterial varchar(10) ,buildweight varchar(10) ,calcprinttime varchar(10) ,powdercondition varchar(10) ,layernumber int(11) DEFAULT NULL,dpcfactor int(11) DEFAULT NULL,minexptime varchar(10) ,comments varchar(200),FOREIGN KEY (build_id) REFERENCES octoprint.build(build_id))'
cursor.execute(sql) 
sql =  'CREATE TABLE if not exists octoprint.postprint(slm_id varchar(10),printedimage varbinary(5000) DEFAULT NULL,supportremoval bit(1) DEFAULT NULL,wedm bit(1) DEFAULT NULL,wedemcomment varchar(100) ,balsting bit(1) DEFAULT NULL,blastingtype varchar(50) ,blastingcomment varchar(100) ,stresstemp varchar(10) ,stresstime varchar(10) ,stressshieldinggas bit(1) DEFAULT NULL,stresscomment varchar(100) ,hardeningtemp varchar(10) ,hardningtime varchar(10) ,hardeningcomment varchar(100) ,temperingtemp varchar(10) ,temperingtime varchar(10) ,temperingcycles varchar(10) ,temperingcomment varchar(100) ,solutiontemp varchar(10) , solutiontime varchar(10) ,solutioncomment varchar(100) ,agingtemp varchar(10) ,agingtime varchar(10) ,agingcycles varchar(10) ,agingcomment varchar(100),  FOREIGN KEY (slm_id) REFERENCES octoprint.printing(slm_id))'
cursor.execute(sql)
sql =  'CREATE TABLE if not exists octoprint.users(user_id varchar(10) PRIMARY KEY ,name varchar(25) ,password varchar(10) ,access_type varchar(10) ,deleted bit(1),information varbinary(5000))'
cursor.execute(sql)
sql =  'CREATE TABLE  if not exists octoprint.userfiles (user_id varchar(10),detailed_id varchar(10),slm_id varchar(10) ,build_id varchar(10) ,type varchar(10) ,  FOREIGN KEY (user_id) REFERENCES octoprint.users(user_id), FOREIGN KEY (detailed_id) REFERENCES octoprint.details(detailed_id) , FOREIGN KEY (build_id) REFERENCES octoprint.build(build_id), FOREIGN KEY (slm_id) REFERENCES octoprint.printing(slm_id))'
cursor.execute(sql) 
sql =  'CREATE TABLE  if not exists octoprint.log (user_id varchar(10),login date DEFAULT NULL,logout date DEFAULT NULL,file_accessed varchar(1000),FOREIGN KEY (user_id) REFERENCES octoprint.users(user_id) )'
cursor.execute(sql)

#### else login octoprint and get values 
db = MySQLdb.connect(host="localhost",   user="root",  passwd="root", db="octoprint")   
cur = db.cursor()  

## insert values into octoprint tables
 ##cur.execute('INSERT INTO octoprint.customer VALUES (%s,%s)""", (245,Segma)')
 
 cursor.execute('commit')
 db.commit()

 x.execute("""INSERT INTO anooog1 VALUES (%s,%s)""",(188,90))
 db.commit() 

 INSERT INTO octoprint.customer(customer_id,name) VALUES ("245","Segma");


cur.execute("SELECT * FROM octoprint.users")
 
# print the first and second columns      
for row in cur.fetchall() :
    print(row[0], " ", row[1])
