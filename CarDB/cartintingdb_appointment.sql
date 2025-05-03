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
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `AppointmentID` int NOT NULL AUTO_INCREMENT,
  `ClientID` int DEFAULT NULL,
  `VehicleDetails` varchar(100) DEFAULT NULL,
  `TintType` varchar(50) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Time` time DEFAULT NULL,
  `Status` varchar(30) DEFAULT NULL,
  `AssignedEmployeeID` int DEFAULT NULL,
  PRIMARY KEY (`AppointmentID`),
  KEY `ClientID` (`ClientID`),
  KEY `AssignedEmployeeID` (`AssignedEmployeeID`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`ClientID`) REFERENCES `client` (`ClientID`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`AssignedEmployeeID`) REFERENCES `employee` (`EmployeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (17,4,'Toyota','Dyed Tint','2025-05-01','10:00:00','Assigned',3),(18,4,'Toyota','Automotive Window Tinting','2025-05-10','02:00:00','Canceled',NULL),(19,4,'Toyota','Automotive Window Tinting','2025-05-10','02:00:00','Completed',3),(20,3,'Honda','Automotive Window Tinting','2025-05-09','16:07:00','Assigned',3),(21,4,'Toyota','Automotive Window Tinting','2025-05-10','04:45:00','Assigned',1),(22,4,'Toyota','Automotive Window Tinting','2025-05-10','04:45:00','Scheduled',NULL),(23,4,'sgaijaks','Automotive Window Tinting','2025-05-03','04:48:00','Scheduled',NULL),(24,4,'Toyota','Automotive Window Tinting','2025-05-08','04:48:00','Scheduled',NULL),(26,4,'Sierra','Automotive Window Tinting','2025-05-01','16:41:00','Assigned',3),(27,4,'Honda','Automotive Window Tinting','2025-05-10','09:57:00','Paid',NULL),(28,8,'SUV','Automotive Window Tinting','2025-05-10','23:18:00','Paid',NULL),(29,4,'sgaijaks','Automotive Window Tinting','2025-05-10','17:48:00','Scheduled',NULL);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
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
