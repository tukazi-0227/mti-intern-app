const {
  DynamoDBClient,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_Article";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
   if (event.headers.authorization !== "mtiToken") {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください",
    });

    return response;
  }

  const userId = event.queryStringParameters?.userId;
  const timestamp = parseInt(event.queryStringParameters?.timestamp);
  if (!userId || !timestamp) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。query parameterに必須パラメータがセットされていません。",
    });

    return response;
  }

  // TODO: 削除対象のテーブル名と削除したいデータのkeyをparamに設定
  const param = {
    TableName,
    Key: marshall({
      userId,
      timestamp
    }),
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
