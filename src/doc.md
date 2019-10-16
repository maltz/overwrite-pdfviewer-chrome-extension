## First approach
```plantuml

skinparam backgroundColor f6f6f6
title First. iframe srcdoc ver
actor User

participant "Background.js" as b
participant "inject.js" as i
participant "popup.js" as p
participant "extract.js" as e
participant "MLServer" as m

User -> b: click button
b -> i: inject
i -> p: append iframe (vue.js)
e -> p: contents
p -> m: contents
p <- m: mlResponce

User <- p: 
```
iframeのsrcdocにhtmlを入れる方式だと、ページのコンテンツにアクセスできる（srcだとできない)ので、popupで文章を取って推論サーバーに投げて表示するだけでいいのでシンプルな実装になる。ただ推論サーバーがhttpだとmixed requestでhttpsのサイトから投げれない。background.jsで推論させたほうが良いのではと思った。

## Secound approach

```plantuml
skinparam backgroundColor f6f6f6
title First. iframe srcdoc ver
actor User

participant "Background.js" as b
participant "extract.js" as e
participant "MLServer" as m
participant "inject.js" as i
participant "popup.js" as p

User -> b: click button
b -> e: inject
b <- e: contents

b -> m: contents
b <- m: mlResponce

b -> i: inject
i -> p: inject iframe (vue.js)
p -> b: mlResponceくれ
p <- b: mlResponce
```

先にbackground.jsで推論サーバーに投げて、待ってる間にvue.jsのpopupをレンダリングする方式。シングルスレッドなので推論サーバーの待ち時間にレンダリングをやっている　なんてことはできていなかった。残念。vue.jsのレンダリングが遅い。
```
ボタンを押してからvue.jsのmountedまでの時間

推論サーバーに問い合わせる場合

<!-- ## アイコンを押してからの処理の流れ -->
```plantuml
@startuml
skinparam backgroundColor #EEEBDC
skinparam handwritten true

title First. iframe srcdoc ver
Background.js -> inject.js: inject
inject.js -> popup.js: inject iframe (vue.js)
extract.js --> popup.js:  {content}
popup.js -> MLServer: {content}
MLServer -> popup.js: {mlResponce}
@enduml
```
iframeのsrcdocにhtmlを入れる方式だと、ページの文章を取得できる(srcだとできない)ので余計なファイルや内部通信がいらないのでシンプルにできる。
ただ、推論サーバーがhttpだとmixed requestでエラる。
background.jsで推論サーバーと通信させたほうが良いのではと思った。

```plantuml
@startuml
skinparam backgroundColor #EEEBDC
skinparam handwritten true

title Second. iframe src ver
Background.js -> extract.js: inject
extract.js --> Background.js: sendMessage {content}
Background.js -> MLServer: {content}
MLServer -> Background.js: {mlResponce}
Background.js -> inject.js: inject
inject.js -> popup.js: inject iframe (vue.js)
popup.js -> Background.js: {mlResponce}くれ
Background.js -> popup.js: {mlResponce}
@enduml
```
先にbackground.jsで推論サーバーに投げて、待ってる間にvue.jsのpopupをレンダリングする方式。popup.jsからbackground.jsに50msに一回、推論結果がを問い合わせている。
この方法がベストだと思ったが、vue.jsのpopupのレンダリングが結構遅い
```
ボタン押したときからvue.jsのmountedまでの時間

推論サーバー投げた時

1046ms
317ms
841ms


推論サーバーに問い合わせない場合　（単純なvue.jsの表示）
294ms
223ms
494ms
434ms
```

遅い。contentScriptで先にvueをレンダリングしておいて、ボタンを押したらアニメーションで可視化するようにしたら早いのではないか。

## Third approach

```plantuml
@startuml
skinparam backgroundColor f6f6f6
actor User

participant "ContentScript.js" as c
participant "popup.js" as p
participant "Background.js" as b
participant "extract.js" as e
participant "MLServer" as m

c -> c: ページ読み込まれた
c -> p: inject iframe (vue.js)

User -> b: click button
b -> p: show
b -> e: inject
b <- e: contents

b -> m: contents
b <- m: mlResponce

b -> p: mlResponce

p -> User
@enduml
```

## TIME
- ボタンを押してからextract.jsでコンテンツを取得しbackground.jsに返すまでの時間
118
117
110
124
74
- ボタンを押してからextract.jsでコンテンツを取得し、mlserverに投げてから帰ってくるまでの時間
351
932
942
368

コンテンツ取得に100msくらいかかる。タブが更新されたら予めコンテンツを収集しておくのもあり。
やり方としては、
- contentScriptで常に取得して保持しておき、ボタンを押したらbackgroundから問い合わせる。
- backgroundでタブの状態を検知し、extract.jsを走らせる?

mlserverが遅い、同じページで2回やると早くなるため、word2vecをキャッシュしているのではと思う

## Fourth approach

```plantuml
@startuml
skinparam backgroundColor f6f6f6
actor User

participant "ContentScript.js" as c
participant "popup.js" as p
participant "Background.js" as b
participant "extract.js" as e
participant "MLServer" as m

c -> c: ページ読み込まれた
c -> p: inject iframe (vue.js)
c -> c: extract content

User -> b: click button
b -> c: get contents
b <- c: return contents
b -> p: show
p -> User: popup show

b -> m: contents
b <- m: mlResponce

b -> p: mlResponce

p -> User: recommend tag etc.
@enduml
```

## CRUD

```plantuml
@startuml
skinparam backgroundColor f6f6f6
actor User

participant "popup.js" as p
participant "Background.js" as b
participant "MLServer" as m
participant "Firestore" as f

b -> m: contents
b <- m: mlResponce
b -> p: mlResponce
p -> User: auto classify result

b -> b: mlResponceTag -> userTag
b -> f: mlResponce
b <- f: tabId: recordId
User -> p: modify tag, done or deferrd
p -> b: tabId: {modified data}
b -> f: modify
@enduml
```

## isSaved?
昔保存したか？タブ変わる度にFireStoreにクエリを叩くのは違う気がする。ここ直近でいい気がする。
例えば、直近100件をBackground.jsに保持しておいて、tabs.onUpdateの度にそこにurlがあるか確認する。

```plantuml
@startuml
title: だめパターン
skinparam backgroundColor f6f6f6
actor User

participant "Icon" as i
participant "Background.js" as b
participant "Firestore" as f

b -> b: tabs.onUpdated
b -> f: isSavedTab?
b <- f: url: Bool
b -> i: show ✓
i -> User
@enduml
```
```plantuml
@startuml
title: 節約パターン
skinparam backgroundColor f6f6f6
actor User

participant "Icon" as i
participant "Background.js" as b
participant "Firestore" as f

b <- f: 直近100個のtab
b -> b: tabs.onUpdated
b -> b: 新しいurlはある？ (isSavedTab?)
b -> i: show ✓
i -> User

User -> b: save
b -> i: show ✓
@enduml
```

## 新規アイテム 保存の仕方
```plantuml
@startuml
title: 新規アイテム 保存の仕方
skinparam backgroundColor f6f6f6
actor User
participant "popup.js" as p
participant "Background.js" as b
participant "MLServer" as m
participant "Firestore" as f
participant "Icon" as i

User -> b: click
b -> b: このurl保存してある？No
m --> b: mlresponce
b -> b: mlresponce -> tags
b -> f: tags, title, url, etc
b <-- f: tab objectId
b -> p: tab objectId

User -> p: recommendTagから選択
p -> b: tag, tab objectId
b -> f: tag name
b <-- f: tag objectId
b -> f: tab objectId.put(tag)
b <-- f: suc
b -> p

User -> p: tagを削除
p -> b: tag, tab objectId
b -> f: tab objectId.delete(tag)
b <-- f: suc
b -> p

User -> p: typeを編集する
p -> b: type, tab objectId
b -> f: tab objectId.put(type)
b <-- f: suc
b -> p

User -> b: click
b -> b: このurl保存してある？Yes
m --> b: mlresponce
b -> p: tabItem, recommend_tags

@enduml
```


## Problem
- ログインサインアップ遷移
- Background.jsでどうやってUser/Tagsを保持するか（vuexかvanillaか）
- popupを開いている最中にタグの更新があってもPopup中のタグは更新しない
- User/Tagsをどうやって変換してMLServerに送信するか
- mlResponceをUser/Tagsにどうやって変換し保存するか。
- BackgroundでFireStoreを変更する関数は何が必要か
- recommend tagをクリックしたらFireStoreに保存して帰ってきたIDを使用する。

## TODO
- インストールした時、すでにあるタブはcontentscript.jsが仕込まれていないので、injectする
- mlResponceの結果をurlをkeyにキャッシュする
- urlが変わる時popupを非表示する？
