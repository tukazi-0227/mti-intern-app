const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
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

  //TODO: 取得対象のテーブル名をparamに宣言
  const param = {
    TableName,
  };

  const command = new ScanCommand(param);

  try {
    // client.send()で全件取得するコマンドを実行
    const articles = (await client.send(command)).Items;

    //TODO: 全ユーザのpasswordを隠蔽する処理を記述
    articles?.forEach((item) => delete item?.password);
    const unmarshalledUsersItems = articles.map((item) => unmarshall(item));
    //TODO: レスポンスボディを設定する
    response.body = JSON.stringify({ users: unmarshalledUsersItems });
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
