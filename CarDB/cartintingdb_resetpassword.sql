-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: cartintingdb
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `resetpassword`
--

DROP TABLE IF EXISTS `resetpassword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resetpassword` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpirationDate` datetime NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resetpassword`
--

LOCK TABLES `resetpassword` WRITE;
/*!40000 ALTER TABLE `resetpassword` DISABLE KEYS */;
INSERT INTO `resetpassword` VALUES (1,'Sosuke','sosukeaizen988@gmail.com','029093f0c9fba2f0268c0f711e2f76948cb47dd8','2025-04-30 18:39:30'),(2,'Sosuke','sosukeaizen988@gmail.com','0becd7987a98b7041d0c29a64233dfd301ab6876','2025-04-30 18:41:20'),(3,'Sosuke','sosukeaizen988@gmail.com','e7270e4a62c005ba497b29342d7bcb19459424c2','2025-04-30 18:45:27'),(4,'Sosuke','sosukeaizen988@gmail.com','b136be2b2b679abfda76df65b5a810e4a8e0fb4d','2025-04-30 18:51:27'),(5,'Sosuke','sosukeaizen988@gmail.com','039ea0a97f327bd0448f5e0e2a66cbc7b4ba123f','2025-04-30 19:21:24'),(6,'Sosuke','sosukeaizen988@gmail.com','3200f41b85a36e5f957a3ec9d2c5047b65047448','2025-04-30 19:28:44'),(7,'Sosuke','sosukeaizen988@gmail.com','a9644fb573b8cad467dfbb227180f2475b3a9413','2025-04-30 19:30:30'),(8,'Sosuke','sosukeaizen988@gmail.com','96d37aee499cf3b5bf8491f505fc52fbb30c20d7','2025-04-30 19:31:24'),(10,'Youssef','aizengoku1@gmail.com','24123ff115b0cea1fc9623d7aa2714374a307d15','2025-04-30 20:00:55'),(12,'Youssef','aizengoku1@gmail.com','4e55365476b353903abdd52077a09f7eee94d31a','2025-05-01 00:46:23');
/*!40000 ALTER TABLE `resetpassword` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-03  2:13:21
