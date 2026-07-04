SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` varchar(20) DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `role`, `created_at`) VALUES
(1, 'admin@findash.com', '$2y$10$eO...mockhash...', 'Admin User', 'admin', '2026-07-04 12:00:00');
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` enum('revenue','expense') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `region` varchar(100) DEFAULT 'Global',
  `transaction_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `budgets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department` varchar(100) NOT NULL,
  `allocated_amount` decimal(15,2) NOT NULL,
  `financial_year` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(150) NOT NULL,
  `region` varchar(100) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `status` enum('Paid','Pending','Overdue') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `product_sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `units_sold` int(11) NOT NULL,
  `sale_price_per_unit` decimal(10,2) NOT NULL,
  `sale_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE `risk_assessments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `risk_name` varchar(200) NOT NULL,
  `impact_score` int(1) NOT NULL CHECK (`impact_score` BETWEEN 1 AND 5),
  `probability_score` int(1) NOT NULL CHECK (`probability_score` BETWEEN 1 AND 5),
  `compliance_status` enum('Pass','Fail','Warning') DEFAULT 'Pass',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;


-- ==========================================
-- DUMMY DATA SEEDING
-- ==========================================

-- Transactions
INSERT INTO `transactions` (`user_id`, `type`, `amount`, `category`, `department`, `region`, `transaction_date`) VALUES
(1, 'revenue', 5541.00, 'Consulting', 'HR', 'North America', '2026-01-27'),
(1, 'revenue', 20310.00, 'Support Contracts', 'Executive', 'Asia', '2026-01-24'),
(1, 'expense', 12370.00, 'Travel', 'HR', 'Europe', '2026-01-23'),
(1, 'expense', 9322.00, 'Travel', 'Sales', 'Europe', '2026-01-06'),
(1, 'expense', 5733.00, 'Marketing', 'Sales', 'Asia', '2026-01-24'),
(1, 'expense', 8435.00, 'Payroll', 'Sales', 'LATAM', '2026-01-28'),
(1, 'revenue', 5092.00, 'Support Contracts', 'Engineering', 'LATAM', '2026-01-21'),
(1, 'expense', 2240.00, 'Software', 'HR', 'North America', '2026-01-25'),
(1, 'revenue', 15385.00, 'Consulting', 'Marketing', 'Asia', '2026-01-17'),
(1, 'revenue', 23243.00, 'Software Sales', 'HR', 'North America', '2026-01-03'),
(1, 'expense', 9744.00, 'Software', 'Sales', 'LATAM', '2026-01-18'),
(1, 'expense', 6013.00, 'Payroll', 'Engineering', 'North America', '2026-01-26'),
(1, 'expense', 5437.00, 'Office', 'Executive', 'Europe', '2026-01-23'),
(1, 'expense', 12258.00, 'Legal', 'Engineering', 'North America', '2026-01-15'),
(1, 'revenue', 21304.00, 'Consulting', 'HR', 'North America', '2026-01-15'),
(1, 'expense', 11210.00, 'Marketing', 'Engineering', 'Europe', '2026-01-27'),
(1, 'revenue', 24222.00, 'Hardware', 'Executive', 'Europe', '2026-01-19'),
(1, 'revenue', 8080.00, 'Software Sales', 'Marketing', 'Asia', '2026-01-25'),
(1, 'revenue', 21112.00, 'Consulting', 'Sales', 'Asia', '2026-02-02'),
(1, 'revenue', 14876.00, 'Hardware', 'Marketing', 'North America', '2026-02-22'),
(1, 'expense', 10432.00, 'Payroll', 'Engineering', 'North America', '2026-02-21'),
(1, 'expense', 3241.00, 'Office', 'Marketing', 'LATAM', '2026-02-27'),
(1, 'revenue', 12327.00, 'Hardware', 'Sales', 'Europe', '2026-02-10'),
(1, 'revenue', 10496.00, 'Software Sales', 'Sales', 'LATAM', '2026-02-01'),
(1, 'revenue', 21323.00, 'Software Sales', 'Sales', 'North America', '2026-02-02'),
(1, 'expense', 13456.00, 'Software', 'HR', 'Asia', '2026-02-28'),
(1, 'revenue', 24593.00, 'Consulting', 'Executive', 'Europe', '2026-02-18'),
(1, 'revenue', 10183.00, 'Support Contracts', 'Sales', 'LATAM', '2026-02-13'),
(1, 'revenue', 11831.00, 'Support Contracts', 'HR', 'Europe', '2026-02-12'),
(1, 'revenue', 20878.00, 'Hardware', 'Sales', 'Asia', '2026-03-03'),
(1, 'revenue', 13301.00, 'Consulting', 'Sales', 'LATAM', '2026-03-10'),
(1, 'revenue', 21821.00, 'Consulting', 'Executive', 'Asia', '2026-03-06'),
(1, 'expense', 9995.00, 'Software', 'HR', 'Asia', '2026-03-24'),
(1, 'expense', 12090.00, 'Travel', 'Marketing', 'Asia', '2026-03-15'),
(1, 'revenue', 9263.00, 'Support Contracts', 'Marketing', 'Europe', '2026-03-01'),
(1, 'revenue', 21866.00, 'Hardware', 'Sales', 'Europe', '2026-03-13'),
(1, 'revenue', 7689.00, 'Software Sales', 'Executive', 'North America', '2026-03-26'),
(1, 'revenue', 22967.00, 'Support Contracts', 'Engineering', 'LATAM', '2026-03-03'),
(1, 'expense', 7768.00, 'Legal', 'Marketing', 'LATAM', '2026-03-14'),
(1, 'revenue', 16606.00, 'Software Sales', 'Engineering', 'Europe', '2026-04-25'),
(1, 'expense', 8015.00, 'Legal', 'Engineering', 'LATAM', '2026-04-28'),
(1, 'expense', 6186.00, 'Payroll', 'HR', 'North America', '2026-04-25'),
(1, 'revenue', 20194.00, 'Consulting', 'Executive', 'Europe', '2026-04-13'),
(1, 'revenue', 23909.00, 'Hardware', 'Engineering', 'North America', '2026-04-02'),
(1, 'revenue', 5601.00, 'Hardware', 'Marketing', 'North America', '2026-04-11'),
(1, 'expense', 10563.00, 'Office', 'Sales', 'Asia', '2026-04-23'),
(1, 'revenue', 18774.00, 'Hardware', 'Marketing', 'Europe', '2026-04-23'),
(1, 'revenue', 6502.00, 'Software Sales', 'HR', 'Asia', '2026-04-27'),
(1, 'revenue', 15520.00, 'Hardware', 'Executive', 'LATAM', '2026-04-08'),
(1, 'expense', 4033.00, 'Travel', 'Marketing', 'LATAM', '2026-04-01'),
(1, 'revenue', 19888.00, 'Support Contracts', 'Executive', 'Asia', '2026-05-12'),
(1, 'revenue', 9601.00, 'Hardware', 'Sales', 'Europe', '2026-05-05'),
(1, 'revenue', 19210.00, 'Consulting', 'Engineering', 'LATAM', '2026-05-25'),
(1, 'revenue', 21678.00, 'Consulting', 'Sales', 'Asia', '2026-05-27'),
(1, 'revenue', 24647.00, 'Consulting', 'Marketing', 'Europe', '2026-05-10'),
(1, 'revenue', 16842.00, 'Hardware', 'HR', 'Europe', '2026-05-27'),
(1, 'revenue', 20974.00, 'Software Sales', 'Marketing', 'Europe', '2026-05-25'),
(1, 'revenue', 11494.00, 'Consulting', 'Executive', 'LATAM', '2026-05-04'),
(1, 'revenue', 12174.00, 'Consulting', 'HR', 'LATAM', '2026-05-04'),
(1, 'revenue', 15240.00, 'Software Sales', 'Engineering', 'Europe', '2026-05-27'),
(1, 'revenue', 19960.00, 'Hardware', 'Sales', 'Europe', '2026-06-18'),
(1, 'revenue', 7373.00, 'Software Sales', 'Engineering', 'Asia', '2026-06-04'),
(1, 'expense', 13804.00, 'Marketing', 'HR', 'Asia', '2026-06-13'),
(1, 'expense', 13051.00, 'Payroll', 'Engineering', 'Europe', '2026-06-20'),
(1, 'revenue', 23313.00, 'Hardware', 'Sales', 'North America', '2026-06-27'),
(1, 'expense', 8492.00, 'Payroll', 'HR', 'LATAM', '2026-06-07'),
(1, 'revenue', 5329.00, 'Consulting', 'Executive', 'North America', '2026-06-27'),
(1, 'revenue', 13975.00, 'Software Sales', 'HR', 'LATAM', '2026-06-06'),
(1, 'revenue', 24027.00, 'Hardware', 'Sales', 'Asia', '2026-06-04'),
(1, 'revenue', 10869.00, 'Software Sales', 'Executive', 'Europe', '2026-06-19'),
(1, 'revenue', 15583.00, 'Support Contracts', 'Engineering', 'Asia', '2026-06-09'),
(1, 'expense', 2681.00, 'Software', 'Sales', 'LATAM', '2026-07-25'),
(1, 'expense', 9528.00, 'Travel', 'Sales', 'North America', '2026-07-10'),
(1, 'revenue', 11947.00, 'Hardware', 'Sales', 'Europe', '2026-07-13'),
(1, 'revenue', 8497.00, 'Hardware', 'Engineering', 'LATAM', '2026-07-22'),
(1, 'revenue', 6334.00, 'Consulting', 'Executive', 'North America', '2026-07-17'),
(1, 'expense', 9106.00, 'Legal', 'Executive', 'North America', '2026-07-23'),
(1, 'revenue', 10672.00, 'Software Sales', 'Executive', 'Asia', '2026-07-20'),
(1, 'revenue', 21315.00, 'Hardware', 'Executive', 'Europe', '2026-07-21'),
(1, 'revenue', 14454.00, 'Software Sales', 'Marketing', 'North America', '2026-07-19'),
(1, 'expense', 6834.00, 'Office', 'Executive', 'Europe', '2026-07-18'),
(1, 'expense', 13266.00, 'Office', 'Sales', 'LATAM', '2026-07-18'),
(1, 'expense', 9172.00, 'Office', 'Sales', 'North America', '2026-07-24'),
(1, 'expense', 12602.00, 'Payroll', 'Marketing', 'LATAM', '2026-07-25'),
(1, 'revenue', 22884.00, 'Software Sales', 'Engineering', 'North America', '2026-07-21'),
(1, 'revenue', 10417.00, 'Consulting', 'Sales', 'LATAM', '2026-07-15'),
(1, 'expense', 5334.00, 'Payroll', 'Sales', 'North America', '2026-07-25');

-- Customers
INSERT INTO `customers` (`company_name`, `region`, `status`) VALUES
('Acme Corp', 'LATAM', 'Active'),
('Global Tech', 'Europe', 'Active'),
('Stark Ind.', 'North America', 'Active'),
('Wayne Ent.', 'Asia', 'Active'),
('Cyberdyne', 'Asia', 'Active'),
('InGen', 'Europe', 'Active'),
('Massive Dynamic', 'Europe', 'Active');

-- Invoices
INSERT INTO `invoices` (`customer_id`, `amount`, `issue_date`, `due_date`, `status`) VALUES
(2, 18300.00, '2026-03-31', '2026-04-30', 'Paid'),
(1, 43900.00, '2026-05-20', '2026-06-19', 'Overdue'),
(5, 16700.00, '2026-05-04', '2026-06-03', 'Overdue'),
(5, 49300.00, '2026-03-14', '2026-04-13', 'Paid'),
(1, 31500.00, '2026-06-17', '2026-07-17', 'Pending'),
(7, 1900.00, '2026-03-17', '2026-04-16', 'Overdue'),
(3, 18700.00, '2026-03-20', '2026-04-19', 'Overdue'),
(1, 40000.00, '2026-03-20', '2026-04-19', 'Paid'),
(7, 33200.00, '2026-04-20', '2026-05-20', 'Paid'),
(6, 19100.00, '2026-05-24', '2026-06-23', 'Overdue'),
(1, 29700.00, '2026-04-03', '2026-05-03', 'Overdue'),
(7, 41400.00, '2026-06-12', '2026-07-12', 'Overdue'),
(5, 10100.00, '2026-05-28', '2026-06-27', 'Overdue'),
(1, 27100.00, '2026-04-06', '2026-05-06', 'Overdue'),
(5, 17400.00, '2026-06-17', '2026-07-17', 'Pending'),
(2, 41100.00, '2026-06-21', '2026-07-21', 'Overdue'),
(4, 17100.00, '2026-06-25', '2026-07-25', 'Overdue'),
(3, 25100.00, '2026-03-22', '2026-04-21', 'Overdue'),
(1, 44300.00, '2026-04-19', '2026-05-19', 'Paid'),
(3, 1600.00, '2026-06-23', '2026-07-23', 'Overdue'),
(7, 38000.00, '2026-05-07', '2026-06-06', 'Paid'),
(4, 3000.00, '2026-03-15', '2026-04-14', 'Overdue'),
(5, 22100.00, '2026-05-19', '2026-06-18', 'Overdue'),
(3, 16600.00, '2026-06-14', '2026-07-14', 'Overdue'),
(7, 37100.00, '2026-04-23', '2026-05-23', 'Overdue'),
(3, 21500.00, '2026-06-23', '2026-07-23', 'Paid'),
(1, 9800.00, '2026-04-23', '2026-05-23', 'Overdue'),
(4, 28400.00, '2026-05-11', '2026-06-10', 'Overdue'),
(6, 34300.00, '2026-04-25', '2026-05-25', 'Paid'),
(3, 31400.00, '2026-03-10', '2026-04-09', 'Overdue'),
(6, 1600.00, '2026-05-24', '2026-06-23', 'Overdue'),
(1, 30200.00, '2026-06-21', '2026-07-21', 'Overdue'),
(1, 29800.00, '2026-05-21', '2026-06-20', 'Overdue'),
(7, 11300.00, '2026-03-22', '2026-04-21', 'Overdue'),
(4, 26000.00, '2026-03-23', '2026-04-22', 'Paid'),
(4, 21000.00, '2026-03-27', '2026-04-26', 'Overdue'),
(1, 25900.00, '2026-05-15', '2026-06-14', 'Overdue'),
(6, 9500.00, '2026-03-09', '2026-04-08', 'Paid'),
(6, 37800.00, '2026-06-09', '2026-07-09', 'Overdue'),
(5, 40700.00, '2026-05-23', '2026-06-22', 'Overdue'),
(5, 29000.00, '2026-05-27', '2026-06-26', 'Paid'),
(1, 19400.00, '2026-03-13', '2026-04-12', 'Paid'),
(3, 40900.00, '2026-03-31', '2026-04-30', 'Overdue'),
(5, 5400.00, '2026-03-30', '2026-04-29', 'Overdue'),
(7, 17000.00, '2026-05-31', '2026-06-30', 'Overdue'),
(4, 19800.00, '2026-04-18', '2026-05-18', 'Overdue'),
(2, 4500.00, '2026-04-07', '2026-05-07', 'Overdue'),
(7, 36900.00, '2026-05-08', '2026-06-07', 'Overdue'),
(2, 8400.00, '2026-04-20', '2026-05-20', 'Overdue'),
(2, 37800.00, '2026-05-03', '2026-06-02', 'Overdue');

-- Products
INSERT INTO `products` (`name`, `category`, `unit_cost`) VALUES
('Enterprise Cloud', 'Software', 500.00),
('Data Center Server', 'Hardware', 2500.00),
('Consulting Retainer', 'Services', 100.00),
('Security Audit', 'Services', 300.00);

-- Product Sales
INSERT INTO `product_sales` (`product_id`, `units_sold`, `sale_price_per_unit`, `sale_date`) VALUES
(2, 5, 7000.00, '2026-05-07'),
(4, 22, 510.00, '2026-05-04'),
(1, 34, 750.00, '2026-02-09'),
(1, 43, 650.00, '2026-03-12'),
(4, 38, 420.00, '2026-05-16'),
(3, 9, 130.00, '2026-06-30'),
(1, 9, 700.00, '2026-04-06'),
(3, 44, 260.00, '2026-04-09'),
(3, 14, 290.00, '2026-05-21'),
(4, 37, 660.00, '2026-03-04'),
(1, 32, 1200.00, '2026-06-18'),
(3, 39, 140.00, '2026-01-12'),
(3, 20, 270.00, '2026-04-16'),
(1, 46, 650.00, '2026-01-23'),
(4, 11, 810.00, '2026-04-30'),
(4, 35, 600.00, '2026-01-28'),
(4, 35, 360.00, '2026-02-09'),
(3, 41, 210.00, '2026-04-10'),
(1, 33, 800.00, '2026-03-20'),
(2, 28, 3250.00, '2026-03-29'),
(2, 11, 3500.00, '2026-06-17'),
(1, 26, 1350.00, '2026-03-11'),
(3, 6, 120.00, '2026-04-08'),
(4, 16, 390.00, '2026-05-31'),
(3, 35, 130.00, '2026-06-21'),
(3, 40, 240.00, '2026-04-03'),
(4, 38, 630.00, '2026-03-11'),
(3, 45, 270.00, '2026-01-31'),
(3, 26, 150.00, '2026-06-02'),
(4, 20, 630.00, '2026-02-03'),
(3, 48, 170.00, '2026-06-17'),
(2, 31, 3000.00, '2026-05-21'),
(2, 16, 4500.00, '2026-04-30'),
(4, 44, 870.00, '2026-04-04'),
(4, 11, 600.00, '2026-05-18'),
(4, 22, 780.00, '2026-06-06'),
(2, 5, 6500.00, '2026-02-25'),
(2, 22, 4000.00, '2026-04-30'),
(4, 28, 870.00, '2026-06-01'),
(2, 15, 5250.00, '2026-05-08');

-- Risk Assessments
INSERT INTO `risk_assessments` (`risk_name`, `impact_score`, `probability_score`, `compliance_status`) VALUES
('Data Breach', 3, 3, 'Pass'),
('Server Outage', 5, 2, 'Pass'),
('Compliance Fine', 5, 1, 'Pass'),
('Vendor Bankruptcy', 3, 5, 'Fail'),
('Market Crash', 4, 2, 'Pass');

COMMIT;
