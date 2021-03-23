const util = require('util');
var mysqlConfig = {
    config : {
        host : "localhost",
        user : "root",
        password : "11111111",
        database : "vite",
        port : 3306,
        connectionLimit : 30
    },
    baseConfig : function (){
        let baseconfig = JSON.parse(JSON.stringify(this.config))
        baseconfig.database = null
        return baseconfig
    },

    tables : {
        list : "list"
    },

    sql : {
        _createDataBase : 'CREATE DATABASE IF NOT EXISTS `%s` DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci',
        createDataBase(){
            return util.format(this._createDataBase,mysqlConfig.config.database)
        },
        _createUsersTable : 'CREATE TABLE IF NOT EXISTS `%s` (' +
            '`name` varchar(10) NOT NULL COMMENT "name",' +
            '`password` varchar(32) NOT NULL COMMENT "password",' +
            'PRIMARY KEY (`name`) USING BTREE' +
            ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
        createUsersTable(){
            return  util.format(this._createUsersTable, mysqlConfig.tables.list)
        },
        _createUser : 'INSERT INTO `%s` SELECT "xuegao","5f72bdb72c6af06aefcd6dfd6698e6b3"'+
            'FROM dual WHERE not exists (select * from list where name = "xuegao")',
         createUser(){
            return  util.format(this._createUser, mysqlConfig.tables.list )
        }
    }
}
module.exports = mysqlConfig
