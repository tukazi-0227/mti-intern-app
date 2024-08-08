const {
  DynamoDBClient,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_User";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const userId = event.queryStringParameters?.userId;

  // TODO: 削除対象のテーブル名と削除したいデータのkeyをparamに設定
  const param = {
    TableName: TableName,
    Key: marshall({
      userId
    })
  };

  // データを削除するコマンドを用意
  const command = new DeleteItemCommand(param);

  try {
    // client.send()を用いてデータを削除するコマンドを実行
    await client.send(command);
    // TODO: 成功後の処理を記載(status codeを指定する。)
    response.statusCode = 204;

  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
