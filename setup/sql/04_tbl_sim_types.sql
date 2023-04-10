CREATE TABLE IF NOT EXISTS `sim_types`
(
    id   int(11)      NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;

INSERT INTO `sim_types` (name) VALUES ('e-SIM'), ('p-SIM');