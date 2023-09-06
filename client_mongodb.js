const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.port || 3000;
app.listen(port);

const uri = 'mongodb://127.0.0.1:27017/';
// const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6';

async function connectToDatabase() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("mongodb is running!", client)
    try {
        console.log("mongodb is running!")
        // 连接到 MongoDB
        await client.connect();

        // 获取数据库对象
        const database = client.db('admin');

        // 返回数据库连接和数据库对象
        return { client, database };
    } catch (error) {
        console.error('MongoDB 连接错误:', error);
        throw error;
    }
}

app.get('/example', async (req, res) => {
    try {
        const { client, database } = await connectToDatabase();

        // 在这里执行数据库操作，例如查询
        const result = await database.collection('fan').find({}).toArray();

        // 关闭数据库连接
        client.close();

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: '数据库错误' });
    }
});

app.get('/add', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // 连接到 MongoDB
        await client.connect();

        // 获取数据库对象
        const database = client.db('users'); // 替换为您的数据库名称

        // 获取集合对象
        const collection = database.collection('fan'); // 替换为您的集合名称
        // 使用 countDocuments 方法检查文档数量
        const documentCount = await collection.countDocuments();
        console.log("collection ==", documentCount);
        if (documentCount > 0) {
            console.log('集合包含数据');
            // 查询要更新的文档条件
            const query = { name: 'fan' }; // 替换为您的查询条件

            // 使用 findOne 方法查询文档
            const result = await collection.findOne(query);
            if (result) {
                const _age = result.age;
                console.log('获取到的年龄 (age):', _age);
                // 更新操作，使用 $set 操作符来更新 age 属性
                const update = { $set: { age: _age + 1 } }; // 更新 age 属性为 age + 1
                // 使用 updateOne 或 updateMany 方法更新文档
                const updateResult = await collection.updateOne(query, update);
            } else {
                console.log('未找到匹配的文档');
            }
        } else {
            console.log('集合为空');
            // 要插入的文档数据
            const documentToInsert = {
                name: 'fan',
                age: 30,
                email: 'john@example.com',
            };
            // // 插入单个文档
            const insertResult = await collection.insertOne(documentToInsert);

            console.log('插入的文档 ID:', insertResult.insertedId);
        }

        await client.close();

    } catch (error) {
        res.status(500).json({ error: '新增数据库错误' });
    }
});