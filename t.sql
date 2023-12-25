CREATE TABLE Depot (
    DepotID INT CONSTRAINT nn_depot_depotid NOT NULL,
    DepotName NVARCHAR(255) CONSTRAINT nn_depot_depotname NOT NULL,
    NumberOfParkingPlaces INT CONSTRAINT nn_depot_numberofparkingplaces NOT NULL,
    NumberOfRepaingPlaces INT CONSTRAINT nn_depot_numberofrepaingplaces NOT NULL,
    DepotAddress NVARCHAR(255) CONSTRAINT nn_depot_depotaddress NOT NULL,
    ContactPhone VARCHAR(50) CONSTRAINT nn_depot_contactphone NOT NULL,

    CONSTRAINT [pk_depot_depotid] PRIMARY KEY (DepotID),
);



CREATE TABLE Couplings (
    CouplingId INT CONSTRAINT nn_couplings_couplingid NOT NULL,
    NumberOfWagons SMALLINT CONSTRAINT nn_couplings_numberofwagons NOT NULL,
    CouplingsLength SMALLINT CONSTRAINT nn_couplings_couplingslength NOT NULL,
    DateOfFormingCoupling DATE CONSTRAINT nn_couplings_dateofformingcoupling NOT NULL,
    isReverseMovementAvailable BIT CONSTRAINT nn_couplings_isreversemovementavailable NOT NULL,

    CONSTRAINT [pk_couplings_couplingid] PRIMARY KEY (CouplingId),
);



CREATE TABLE Trolley (
    TrolleyId INT CONSTRAINT nn_trolley_trolleyid NOT NULL,
    DepotId INT CONSTRAINT nn_trolley_depotid NOT NULL,
    TrolleyModel NVARCHAR(255) CONSTRAINT nn_trolley_trolleymodel NOT NULL,
    YearOfConstruct SMALLINT CONSTRAINT nn_trolley_yearofconstruct NOT NULL,
    DateOfMajorRepair DATE CONSTRAINT null_trolley_dateofmajorrepair NULL,
    TotalNumberOfSeats SMALLINT CONSTRAINT nn_trolley_totalnumberofseats NOT NULL,
    NumberOfSeats SMALLINT CONSTRAINT nn_trolley_numberofseats NOT NULL,
    TrolleyLength SMALLINT CONSTRAINT nn_trolley_trolleylength NOT NULL,
    NumberOfCarts SMALLINT CONSTRAINT nn_trolley_numberofcarts NOT NULL,
    NumberOfSectionsInTrain SMALLINT CONSTRAINT nn_trolley_numberofsectionsintrains NOT NULL,


    CONSTRAINT [pk_trolley_trolleyid] PRIMARY KEY (TrolleyId),
    CONSTRAINT [fk_trolley_depotid] FOREIGN KEY (DepotId) REFERENCES Depot (DepotId) 
);


CREATE TABLE CouplingsCompositions (
    CouplingId INT CONSTRAINT nn_couplingscompositions_couplingid NOT NULL,
    TrolleyId INT CONSTRAINT nn_couplingscompositions_trolleyid NOT NULL,
    HeadTrolleyId INT CONSTRAINT nn_couplingscompositions_headtrolleyid NOT NULL,
    NumberOfWagonInComposition INT CONSTRAINT pk_couplingscompositions_numberofwagonincomposition NOT NULL,

    CONSTRAINT [pk_couplingscompositions_couplingid_trolleyid_headtrolleyid] PRIMARY KEY (CouplingId, TrolleyId, HeadTrolleyId),

    CONSTRAINT [fk_couplingscompositions_couplingid] FOREIGN KEY (CouplingId) REFERENCES Couplings (CouplingId)
    ON DELETE CASCADE,

    CONSTRAINT [fk_couplingscompositions_trolleyid] FOREIGN KEY (TrolleyId) REFERENCES Trolley (TrolleyId)
    ON DELETE CASCADE,

    CONSTRAINT [fk_couplingscompositions_headtrolleyid] FOREIGN KEY (HeadTrolleyId) REFERENCES Trolley (TrolleyId)
);


CREATE TABLE Paths (
    DepotId INT CONSTRAINT nn_paths_depotid NOT NULL,
    PathId INT CONSTRAINT nn_paths_pathid NOT NULL,
    Destination NVARCHAR(255) CONSTRAINT nn_paths_destination NOT NULL,
    IsPathFree BIT CONSTRAINT nn_paths_iswayfree NOT NULL,
    IsElectrifiedPath BIT CONSTRAINT nn_paths_iselectrifiedpath NOT NULL,

    CONSTRAINT [pk_paths_depotid_pathid] PRIMARY KEY (DepotId, PathId),

    CONSTRAINT [fk_paths_depotid] FOREIGN KEY (DepotId) REFERENCES Depot (DepotId)
    ON DELETE CASCADE,
);

CREATE TABLE PathAvailablity (
    DepotId INT CONSTRAINT nn_pathavailablity_depotid NOT NULL,
    PathId INT CONSTRAINT nn_pathavailablity_pathid NOT NULL,
    TrolleyId INT CONSTRAINT nn_pathavailablity_trolleyid NOT NULL,
    DateOfArrival DATE CONSTRAINT nn_pathavailablity_dateofarrival NOT NULL,
    DateOfDepature DATE CONSTRAINT nn_pathavailablity_dateofdepature NOT NULL,
    AdditionalInformation NVARCHAR(255) CONSTRAINT  n_pathavailablity_additionalinformation NULL,

    CONSTRAINT [pk_pathavailablity_depotid_pathid_trolleyid_dateofarrival] PRIMARY KEY (TrolleyId, DateOfArrival),

    CONSTRAINT [fk_pathavailablity_depotid] FOREIGN KEY (DepotId) REFERENCES Depot (DepotId) 
    ON DELETE CASCADE,

    CONSTRAINT [fk_pathavailablity_depotid_pathid] FOREIGN KEY (DepotId, PathId) REFERENCES Paths (DepotId, PathId),

    CONSTRAINT [fk_pathavailablity_trolleyid] FOREIGN KEY (TrolleyId) REFERENCES Trolley (TrolleyId) 
    ON DELETE CASCADE
);







INSERT INTO Depot (DepotID, DepotName, NumberOfParkingPlaces, NumberOfRepaingPlaces, DepotAddress, ContactPhone)
VALUES
    (1, 'Октябрьское трамвайное депо', 100, 50, 'Адрес 1', '+1234567890'),
    (2, 'Московское трамвайное депо', 80, 40, 'Адрес 2', '+9876543210');

INSERT INTO Couplings (CouplingId, NumberOfWagons, CouplingsLength, DateOfFormingCoupling, isReverseMovementAvailable)
VALUES
    (1, 3, 15, '2023-01-15', 1),
    (2, 4, 20, '2023-02-20', 0);

INSERT INTO Trolley (TrolleyId, DepotId, TrolleyModel, YearOfConstruct, DateOfMajorRepair, TotalNumberOfSeats, NumberOfSeats, TrolleyLength, NumberOfCarts, NumberOfSectionsInTrain)
VALUES
    (1, 1, 'Татра', 2018, '2022-05-10', 50, 40, 12, 2, 5),
    (2, 1, 'Неизвестная модель', 2019, NULL, 60, 50, 14, 3, 6),
	(3, 2, 'Татра', 2018, '2022-05-10', 50, 40, 12, 2, 5)

INSERT INTO CouplingsCompositions (CouplingId, TrolleyId, HeadTrolleyId, NumberOfWagonInComposition)
VALUES
    (1, 1, 1, 1),
    (1, 2, 2, 2),
    (2, 1, 1, 1),
    (2, 2, 2, 2);

INSERT INTO Paths (DepotId, PathId, Destination, IsPathFree, IsElectrifiedPath)
VALUES
    (1, 1, 'Назначение 1', 1, 1),
    (1, 2, 'Назначение 2', 0, 1),
    (2, 1, 'Назначение 3', 1, 0);




-- Занятость путей (номер депо, номер пути, дата и время заезда трамвая, дата и время, выезда трамвая, номер трамвая, дополнительная информация);
INSERT INTO PathAvailablity (DepotId, PathId, TrolleyId, DateOfArrival, DateOfDepature, AdditionalInformation)
VALUES
    (1, 1, 1, '2023-02-01', '2023-02-20', 'Дополнительная информация 2'),
	(2, 1, 3, '2023-02-01', '2023-02-19', 'Дополнительная информация 2'),
	(1, 1, 1, '2023-03-01', '2023-03-15', 'Дополнительная информация 2'),
	(2, 1, 3, '2023-03-01', '2023-03-14', 'Дополнительная информация 2'),
	(1, 1, 1, '2023-05-01', '2023-05-12', 'Дополнительная информация 2'),
	(2, 1, 3, '2023-05-14', '2023-05-15', 'Дополнительная информация 2'),
	(2, 1, 3, '2023-07-01', '2023-07-06', 'Дополнительная информация 2'),
	(1, 1, 1, '2023-07-01', '2023-07-04', 'Дополнительная информация 2'),
    (1, 1, 2, '2023-04-01', '2023-04-03', 'Дополнительная информация 4'),
    (1, 1, 2, '2023-05-01', '2023-05-09', 'Дополнительная информация 5'),
    (1, 1, 2, '2023-06-01', '2023-06-14', 'Дополнительная информация 6'),
    (1, 1, 2, '2023-07-01', '2023-07-10', 'Дополнительная информация 7'),
    (1, 1, 2, '2023-08-01', '2023-08-20', 'Дополнительная информация 8'),
    (1, 1, 2, '2024-02-01', '2024-02-20', 'Дополнительная информация 2'),
	(2, 1, 3, '2024-02-01', '2024-02-19', 'Дополнительная информация 2'),
	(1, 1, 2, '2024-03-01', '2024-03-15', 'Дополнительная информация 2'),
	(2, 1, 3, '2024-03-01', '2024-03-14', 'Дополнительная информация 2'),
	(1, 1, 2, '2024-05-01', '2024-05-12', 'Дополнительная информация 2'),
	(2, 1, 3, '2024-05-14', '2024-05-15', 'Дополнительная информация 2'),
	(2, 1, 3, '2024-07-01', '2024-07-06', 'Дополнительная информация 2'),
	(1, 1, 2, '2024-07-01', '2024-07-04', 'Дополнительная информация 2'),
    (1, 1, 1, '2024-04-01', '2024-04-03', 'Дополнительная информация 4'),
    (1, 1, 1, '2024-05-01', '2024-05-09', 'Дополнительная информация 5'),
    (1, 1, 1, '2024-06-01', '2024-06-14', 'Дополнительная информация 6'),
    (1, 1, 1, '2024-07-01', '2024-07-10', 'Дополнительная информация 7'),
    (1, 1, 1, '2024-08-01', '2024-08-20', 'Дополнительная информация 8')




-- 1. Создать представление, отображающее все трамваи «Татра» Октябрьского трамвайного депо.
CREATE OR ALTER VIEW OctoberDepotTatraTrolleyView AS
SELECT T1.*
FROM Trolley AS T1
LEFT JOIN Depot AS T2 ON T1.DepotId = T2.DepotID
WHERE LOWER(TRIM(T1.TrolleyModel)) = 'татра' AND LOWER(TRIM(T2.DepotName)) = 'октябрьское трамвайного депо'


SELECT * FROM OctoberDepotTatraTrolleyView


-- Создать представление, которое отображает все модели трамваев, для которых среднее время размещения на ремонтных путях сокращалось каждый месяц в течение года.
CREATE OR ALTER VIEW GeRepainers AS 
SELECT T4.TrolleyModel FROM (
	SELECT 
		T3.*, 
		CASE WHEN (LAG(T3.DaysStay) OVER(ORDER BY T3.ArrivalMonth)) < T3.DaysStay THEN 1 ELSE 0 END AS MonthAscCount-- 
		/* Расчитываем разницу простоя в днях в предыдущем месяце и текущем месяце, если в текущем месяце простой больше то 1 иначе 0.
		На основе этого, модель трамвая выбывает из выборки, если сумма мясецев у которых разница в днях больше предыдущего месяце превышает 0*/
	FROM (
		SELECT 
			T1.TrolleyModel, 
			MONTH(T2.DateOfArrival) AS ArrivalMonth, 
			AVG(DATEDIFF(DAY, T2.DateOfArrival, T2.DateOfDepature)) AS DaysStay FROM Trolley AS T1
		LEFT JOIN PathAvailablity AS T2 ON T1.TrolleyId = T2.TrolleyId
		GROUP BY T1.TrolleyModel, MONTH(T2.DateOfArrival)
	) AS T3
) AS T4
GROUP BY T4.TrolleyModel
HAVING SUM(T4.MonthAscCount) = 0





SELECT * FROM  Trolley
SELECT * FROM PathAvailablity

-- 1. Создать представление, отображающее все трамваи «Татра» Октябрьского трамвайного депо.
CREATE OR ALTER VIEW OctoberDepotTatraTrolleyView AS
SELECT T1.*
FROM Trolley AS T1
LEFT JOIN Depot AS T2 ON T1.DepotId = T2.DepotID
WHERE LOWER(T1.TrolleyModel) = 'татра' AND LOWER(T2.DepotName) = 'октябрьское трамвайного депо'


SELECT * FROM OctoberDepotTatraTrolleyView


-- 2. Создать представление, которое отображает все модели трамваев, для которых среднее время размещения на ремонтных путях сокращалось каждый месяц в течение года.
CREATE OR ALTER VIEW TrolleyRepairsDateMeanAsc AS 
SELECT T4.TrolleyModel FROM (
	SELECT 
		T3.*, 
		CASE WHEN (LAG(T3.DaysStay) OVER(PARTITION BY T3.TrolleyModel ORDER BY T3.ArrivalMonth)) < T3.DaysStay THEN 1 ELSE 0 END AS MonthAscCount
		/* Расчитываем разницу простоя в днях в предыдущем месяце и текущем месяце, если в текущем месяце простой больше то 1 иначе 0.
		На основе этого, модель трамвая выбывает из выборки, если сумма мясецев у которых разница в днях больше предыдущего месяце превышает 0*/
	FROM (
		SELECT 
			T1.TrolleyModel, 
			MONTH(T2.DateOfArrival) AS ArrivalMonth, 
			AVG(DATEDIFF(DAY, T2.DateOfArrival, T2.DateOfDepature)) AS DaysStay FROM Trolley AS T1
		LEFT JOIN PathAvailablity AS T2 ON T1.TrolleyId = T2.TrolleyId
		GROUP BY T1.TrolleyModel, MONTH(T2.DateOfArrival)
	) AS T3
) AS T4
GROUP BY T4.TrolleyModel
HAVING SUM(T4.MonthAscCount) = 0


SELECT * FROM TrolleyRepairsDateMeanAsc



SELECT T4.TrolleyModel FROM (
	SELECT 
		T3.*, 
		CASE WHEN (LAG(T3.DaysStay) OVER(PARTITION BY T3.TrolleyModel, T3.ArrivalYear ORDER BY T3.ArrivalMonth)) < T3.DaysStay THEN 1 ELSE 0 END AS MonthAscCount
		/* Расчитываем разницу простоя в днях в предыдущем месяце и текущем месяце, если в текущем месяце простой больше то 1 иначе 0.
		На основе этого, модель трамвая выбывает из выборки, если сумма мясецев у которых разница в днях больше предыдущего месяце превышает 0*/
	FROM (
		SELECT 
			T1.TrolleyModel, 
			MONTH(T2.DateOfArrival) AS ArrivalMonth, 
      		YEAR(T2.DateOfArrival) As ArrivalYear,
			AVG(DATEDIFF(DAY, T2.DateOfArrival, T2.DateOfDepature)) AS DaysStay FROM Trolley AS T1
		LEFT JOIN PathAvailablity AS T2 ON T1.TrolleyId = T2.TrolleyId
		GROUP BY T1.TrolleyModel, MONTH(T2.DateOfArrival), YEAR(T2.DateOfArrival)
	) AS T3
) AS T4
GROUP BY T4.TrolleyModel
HAVING SUM(T4.MonthAscCount) = 0