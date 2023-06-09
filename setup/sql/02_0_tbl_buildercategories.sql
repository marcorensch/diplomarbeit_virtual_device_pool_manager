CREATE TABLE IF NOT EXISTS `builder_categories`
(
    id    int(11)      NOT NULL AUTO_INCREMENT,
    name  varchar(255) NOT NULL,
    alias varchar(255) GENERATED ALWAYS AS (lower(replace(name, ' ', '-'))) STORED,
    PRIMARY KEY (id)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8
    COLLATE = utf8_general_ci;