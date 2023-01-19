const { end } = require('../config/db');
const db = require('../config/db')
require('dotenv').config()
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})
connection.connect()

class User {
    constructor(first_name, last_name, email, address, status, profile_pic, bio, max_position) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.address = address;
        this.status = status;
        this.profile_pic = profile_pic;
        this.bio = bio;
        this.max_position = max_position;
    }

    async save() {
        let d = new Date();
        let yyyy = d.getFullYear();
        let mm = d.getMonth() + 1;
        let dd = d.getDate();

        let createdAtDate = `${yyyy}-${mm}-${dd}`;

        let sql = `INSERT INTO users(first_name,last_name, email,address, status, profile_pic, bio, position, created_at)
         VALUES("${this.first_name}",
         "${this.last_name}",
         "${this.email}",
         "${this.address}",
         "${this.status}",
         "${this.profile_pic}",
         "${this.bio}",
         "${this.max_position}",
         "${createdAtDate}"
         )`;

        const [newUser, _] = await db.execute(sql)
        return newUser
    }

    static findAll() {
        let sql = "SELECT * FROM users ORDER BY position ASC"

        return db.execute(sql)
    }

    static async getMaxPosition() {
        let sql = `SELECT MAX(position) as max_position FROM users`
        const [value, _] = await db.execute(sql)
        const position = +value[0].max_position + 1
        return position
    }

    static findbyId(id) {
        let sql = `SELECT * FROM users WHERE id=${id};`
        return db.execute(sql)
    }

    async update(id) {
        let sql = `UPDATE users
        SET
        first_name = "${this.first_name}",
            last_name = "${this.last_name}",
            email = "${this.email}",
            address = "${this.address}",
            status = "${this.status}",
            profile_pic = "${this.profile_pic}",
            bio = "${this.bio}"
            WHERE id =${id}`

        const [updatedUser, _] = await db.execute(sql)
        return updatedUser
    }

    static deleteOne(id) {
        let sql = `DELETE FROM users WHERE id=${id}`

        return db.execute(sql)
    }

    static deleteBulk(id) {
        let sql = `DELETE FROM users WHERE id=${id}`

        return db.execute(sql)
    }

    static Active(id) {
        let sql = `
        UPDATE users 
        SET 
        status="Active"
        WHERE id = ${id}`

        return db.execute(sql)
    }

    static Inactive(id) {
        let sql = `
        UPDATE users 
        SET 
        status="Inactive"
        WHERE id = ${id}`

        return db.execute(sql)
    }

    static swap2(startIndex, endIndex) {
        console.log('swap2')
        let sql = `
            UPDATE users 
            SET position = 
        CASE
            WHEN position = ${startIndex} THEN ${endIndex}
            WHEN position = ${endIndex} THEN ${startIndex}
            ELSE position
        END;
            `
        return db.execute(sql)
    }

    static reorderTtoB(startIndex, endIndex) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            connection.query('UPDATE users SET temp_position = 9999 WHERE position = ?;', [startIndex])
            connection.query('UPDATE users SET position = position - 1 WHERE position > ? AND position <= ?;', [startIndex, endIndex])
            connection.query('UPDATE users SET position = ? WHERE temp_position = 9999;', [endIndex])
            connection.query('UPDATE users SET temp_position = NULL WHERE position = ?;', [endIndex])
            connection.commit();
        })
    }


    static reorderBtoT(startIndex, endIndex) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            connection.query('UPDATE users SET temp_position = 9999 WHERE position = ?;', [startIndex])
            connection.query('UPDATE users SET position = position + 1 WHERE position >= ? AND position < ?;', [endIndex, startIndex])
            connection.query('UPDATE users SET position = ? WHERE temp_position = 9999;', [endIndex])
            connection.query('UPDATE users SET temp_position = NULL WHERE position = ?;', [endIndex])
            connection.commit();
        })
    }


    static test(endIndex, row1) {
        let j = endIndex - endIndex
        for (let i = 0; i < endIndex; i++) {
            //     let sql = `
            // UPDATE users SET 
            // position=${endIndex} - ${j}
            // WHERE id = ${row1} + ${i}
            // `
            console.log("position", endIndex + j)
            console.log("id", row1 + i)
            j--
            // db.execute(sql)
        }
    }

}



module.exports = User