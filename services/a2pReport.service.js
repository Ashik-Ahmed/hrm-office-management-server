const { Pool } = require("pg");

exports.getPostgresDataService = async () => {

    const pool = new Pool({
        user: 'postgres',
        host: '192.168.10.192',
        database: 'a2p',
        password: 'postgres',
        port: 5432,
    });

    const dbdata = await pool.query("SELECT date, cli, client_id, operator,message_type, sum(count) Dipping_Count FROM public.dipping_summary where date='2023-07-19' group by date, cli, client_id, operator, message_type order by 6 desc");

    return dbdata;
}