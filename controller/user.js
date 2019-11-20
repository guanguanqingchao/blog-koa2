const {
    exec
} = require('../db/mysql')


const login = async (username, password) => {

    const sql = `select username,realname from myblog.users where username='${username}' and password='${password}'`


    // return await exec(sql).then(row => {

    //     // [ RowDataPacket { username: 'guanqingchao', realname: 'alice' } ]
    //     return row[0] || {}
    // })

    const rows = await exec(sql)
    return rows[0] || {}
}

module.exports = {
    login
}