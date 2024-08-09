const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
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

  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.text || !body.category || !body.symptoms|| !body.title　||!body.like) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });

    return response;
  }
  // TODO: リクエストボディの中身をJavaScriptオブジェクトに変換し、1つ、あるいは複数の変数に代入する

  // TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
  const { userId, text, category, symptoms, title, like, url } = JSON.parse(event.body);
  // timestampを定義
  const timestamp = Date.now();
  const param = {
    // ↓プロパティ名と変数名が同一の場合は、値の指定を省略できる。
    TableName, // TableName: TableNameと同じ意味
    Item: marshall({
      userId, // userId: userIdと同じ意味
      text, // age: ageと同じ意味
      category, // nickname: nicknameと同じ意味
      symptoms,
      title,
      like,
      url,
      timestamp
    }),
  };
  
  // DBにデータを登録するコマンドを用意
  const command = new PutItemCommand(param);

  try {
    // client.send()でDBにデータを登録するコマンドを実行
    await client.send(command);
    response.statusCode = 201;
    console.log(Date.now());    
    response.body = JSON.stringify({
      userId,
      text,
      category,
      symptoms,
      timestamp,
      like,
      url,
      title
    });
    
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
