// 引入mysql
var mysql = require('mysql');
var Async = require('async');
var mysqlConfig = require('./mysqlconfig')
//连接数据库池
var pool = mysql.createPool(mysqlConfig.config);

var db = {
    init: function (){
        let connection = mysql.createConnection(mysqlConfig.baseConfig())
        Async.waterfall([
            function (callback){
                connection.query(mysqlConfig.sql.createDataBase(), function (error, result, fields){
                    if(error){
                        callback(error)
                    }

                    pool = mysql.createPool(mysqlConfig.config);
                    console.log('数据库创建成功')
                    callback(null,result)
                })
            },
            function (retOfCreateDB,callback){
                db.query(mysqlConfig.sql.createUsersTable()).then(result => {
                    callback(null,retOfCreateDB,result)
                    console.log('list Table创建成功')
                }).catch(error => {
                    //
                    callback(error)
                })
            },
            function (retOfCreateDB,retOfCreateAB,callback){
                db.query(mysqlConfig.sql.createUser()).then(result => {
                    callback(null,retOfCreateDB,retOfCreateAB,result)
                    console.log('list 一条数据创建成功')
                }).catch(error => {
                    //
                    callback(error)
                })
            },
        ], function (error,retOfCreateDB, retOfCreateAT, retOfCreateDT){
            if(error){
                console.error(error)
            }else {
                // console.log(retOfCreateDB)
                // console.log(retOfCreateAT)
                // console.log(retOfCreateDT)
            }
        })
    },

    query(sql) {
        // sql = String
        return this._operation(sql);
    },

    select(array, table, where, link) {
        // array = Array
        // table = String
        // where = { key: value }
        // link = 'AND' or 'OR' default 'AND'
        let sql = "SELECT ";
        array.forEach(((value, index) => {
            if (index === 0) {
                sql += value;
            } else {
                sql += ',' + value
            }
        }));
        sql += ' FROM ' + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    },

    insert(info, table) {
        // info = { key: value }
        // table = String
        let sql = "INSERT INTO " + table + "(";
        let keyArray = [];
        let valueArray = [];
        Object.keys(info).forEach((key) => {
            keyArray.push(key);
            valueArray.push("'" + info[key] + "'");
        });
        let keyStr = keyArray.join(',');
        let valueStr = valueArray.join(',');
        sql += keyStr + ') ';
        sql += 'VALUES(' + valueStr + ')';
        console.log(sql)
        return this._operation(sql);
    },

    update(info, table, where, link) {
        let sql = "UPDATE " + table + " SET ";
        let sqlArray = [];
        Object.keys(info).forEach((key) => {
            sqlArray.push(key + "='" + info[key] + "'");
        });
        sql += sqlArray.join(',');
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    },

    delete(info, table, where, link) {
        // info = { key: value }
        // table = String
        // where = { key: value }
        // link = 'AND' or 'OR' default 'AND'
        let sql = "DELETE FROM " + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    },

    _operation(sql) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (error,connection){
                if(error){
                    reject(error.message)
                    console.error(error)
                }else {
                    connection.query(sql, (error, result, fields) => {
                        if (error) {
                            console.log(error.message);
                            reject(error.message);
                        } else {
                            resolve(result);
                        }
                    });
                }
                pool.releaseConnection(connection)
            })
        });
    },

    _handleWhereString(where, link) {
        let str = "";
        if (typeof where === "string"){
            str = " WHERE " + where
        }else if (typeof where === "object"){
            let whereArray = [];
            Object.keys(where).forEach((key) => {
                whereArray.push(String(key + "='" + where[key] + "'"));
            });
            if (link) {
                let whereStr = whereArray.join(" " + link + " ");
                str += " WHERE " + whereStr;
            } else {
                let whereStr = whereArray.join(" AND ");
                str += " WHERE " + whereStr;
            }
        }
        return str;
    }
}

module.exports = db;
