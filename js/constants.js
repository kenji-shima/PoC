mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vuamktc2hpbWEiLCJhIjoiY2xhZ2NmZ3BiMGFqbzNubThpbWMxOXU3MCJ9.JlXUW8MwwX1LhhMnbWyUQw';

let localData = [
    { STATE_ID: '01', unemployment: 13.17 },
    { STATE_ID: '02', unemployment: 9.5 },
    { STATE_ID: '04', unemployment: 12.15 },
    { STATE_ID: '05', unemployment: 8.99 },
    { STATE_ID: '06', unemployment: 11.83 },
    { STATE_ID: '08', unemployment: 7.52 },
    { STATE_ID: '09', unemployment: 6.44 },
    { STATE_ID: '10', unemployment: 5.17 },
    { STATE_ID: '12', unemployment: 9.67 },
    { STATE_ID: '13', unemployment: 10.64 },
    { STATE_ID: '15', unemployment: 12.38 },
    { STATE_ID: '16', unemployment: 10.13 },
    { STATE_ID: '17', unemployment: 9.58 },
    { STATE_ID: '18', unemployment: 10.63 },
    { STATE_ID: '19', unemployment: 8.09 },
    { STATE_ID: '20', unemployment: 5.93 },
    { STATE_ID: '21', unemployment: 9.86 },
    { STATE_ID: '22', unemployment: 9.81 },
    { STATE_ID: '23', unemployment: 7.82 },
    { STATE_ID: '24', unemployment: 8.35 },
    { STATE_ID: '25', unemployment: 9.1 },
    { STATE_ID: '26', unemployment: 10.69 },
    { STATE_ID: '27', unemployment: 11.53 },
    { STATE_ID: '28', unemployment: 9.29 },
    { STATE_ID: '29', unemployment: 9.94 },
    { STATE_ID: '30', unemployment: 9.29 },
    { STATE_ID: '31', unemployment: 5.45 },
    { STATE_ID: '32', unemployment: 4.21 },
    { STATE_ID: '33', unemployment: 4.27 },
    { STATE_ID: '34', unemployment: 4.09 },
    { STATE_ID: '35', unemployment: 7.83 },
    { STATE_ID: '36', unemployment: 8.01 },
    { STATE_ID: '37', unemployment: 9.34 },
    { STATE_ID: '38', unemployment: 11.23 },
    { STATE_ID: '39', unemployment: 7.08 },
    { STATE_ID: '40', unemployment: 11.22 },
    { STATE_ID: '41', unemployment: 6.2 },
    { STATE_ID: '42', unemployment: 9.11 },
    { STATE_ID: '44', unemployment: 10.42 },
    { STATE_ID: '45', unemployment: 8.89 },
    { STATE_ID: '46', unemployment: 11.03 },
    { STATE_ID: '47', unemployment: 7.35 },
    { STATE_ID: '48', unemployment: 8.92 },
    { STATE_ID: '49', unemployment: 7.65 },
    { STATE_ID: '50', unemployment: 8.01 },
    { STATE_ID: '51', unemployment: 7.62 },
    { STATE_ID: '53', unemployment: 7.77 },
    { STATE_ID: '54', unemployment: 8.49 },
    { STATE_ID: '55', unemployment: 9.42 },
    { STATE_ID: '56', unemployment: 7.59 }
];

let lookupData = {};

const hospitals = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "Name": "VA Medical Center -- Leestown Division", "Address": "2250 Leestown Rd" }, "geometry": { "type": "Point", "coordinates": [-84.539487, 38.072916] } },
        { "type": "Feature", "properties": { "Name": "St. Joseph East", "Address": "150 N Eagle Creek Dr" }, "geometry": { "type": "Point", "coordinates": [-84.440434, 37.998757] } },
        { "type": "Feature", "properties": { "Name": "Central Baptist Hospital", "Address": "1740 Nicholasville Rd" }, "geometry": { "type": "Point", "coordinates": [-84.512283, 38.018918] } },
        { "type": "Feature", "properties": { "Name": "VA Medical Center -- Cooper Dr Division", "Address": "1101 Veterans Dr" }, "geometry": { "type": "Point", "coordinates": [-84.506483, 38.02972] } },
        { "type": "Feature", "properties": { "Name": "Shriners Hospital for Children", "Address": "1900 Richmond Rd" }, "geometry": { "type": "Point", "coordinates": [-84.472941, 38.022564] } },
        { "type": "Feature", "properties": { "Name": "Eastern State Hospital", "Address": "627 W Fourth St" }, "geometry": { "type": "Point", "coordinates": [-84.498816, 38.060791] } },
        { "type": "Feature", "properties": { "Name": "Cardinal Hill Rehabilitation Hospital", "Address": "2050 Versailles Rd" }, "geometry": { "type": "Point", "coordinates": [-84.54212, 38.046568] } },
        { "type": "Feature", "properties": { "Name": "St. Joseph Hospital", "ADDRESS": "1 St Joseph Dr" }, "geometry": { "type": "Point", "coordinates": [-84.523636, 38.032475] } },
        { "type": "Feature", "properties": { "Name": "UK Healthcare Good Samaritan Hospital", "Address": "310 S Limestone" }, "geometry": { "type": "Point", "coordinates": [-84.501222, 38.042123] } },
        {
            "type": "Feature", "properties": { "Name": "UK Medical Center", "Address": "800 Rose St" }, "geometry": { "type": "Point", "coordinates": [-84.508205, 38.031254] }
        }
    ]
}
    ;
const libraries = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "Name": "Village Branch", "Address": "2185 Versailles Rd" }, "geometry": { "type": "Point", "coordinates": [-84.548369, 38.047876] } },
        { "type": "Feature", "properties": { "Name": "Northside Branch", "ADDRESS": "1733 Russell Cave Rd" }, "geometry": { "type": "Point", "coordinates": [-84.47135, 38.079734] } },
        { "type": "Feature", "properties": { "Name": "Central Library", "ADDRESS": "140 E Main St" }, "geometry": { "type": "Point", "coordinates": [-84.496894, 38.045459] } },
        { "type": "Feature", "properties": { "Name": "Beaumont Branch", "Address": "3080 Fieldstone Way" }, "geometry": { "type": "Point", "coordinates": [-84.557948, 38.012502] } },
        { "type": "Feature", "properties": { "Name": "Tates Creek Branch", "Address": "3628 Walden Dr" }, "geometry": { "type": "Point", "coordinates": [-84.498679, 37.979598] } },
        { "type": "Feature", "properties": { "Name": "Eagle Creek Branch", "Address": "101 N Eagle Creek Dr" }, "geometry": { "type": "Point", "coordinates": [-84.442219, 37.999437] } }
    ]
};

const stores = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.034084142948,
                    38.909671288923
                ]
            },
            "properties": {
                "phoneFormatted": "(202) 234-7336",
                "phone": "2022347336",
                "address": "1471 P St NW",
                "city": "Washington DC",
                "country": "United States",
                "crossStreet": "at 15th St NW",
                "postalCode": "20005",
                "state": "D.C."
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.049766,
                    38.900772
                ]
            },
            "properties": {
                "phoneFormatted": "(202) 507-8357",
                "phone": "2025078357",
                "address": "2221 I St NW",
                "city": "Washington DC",
                "country": "United States",
                "crossStreet": "at 22nd St NW",
                "postalCode": "20037",
                "state": "D.C."
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.043929,
                    38.910525
                ]
            },
            "properties": {
                "phoneFormatted": "(202) 387-9338",
                "phone": "2023879338",
                "address": "1512 Connecticut Ave NW",
                "city": "Washington DC",
                "country": "United States",
                "crossStreet": "at Dupont Circle",
                "postalCode": "20036",
                "state": "D.C."
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.0672,
                    38.90516896
                ]
            },
            "properties": {
                "phoneFormatted": "(202) 337-9338",
                "phone": "2023379338",
                "address": "3333 M St NW",
                "city": "Washington DC",
                "country": "United States",
                "crossStreet": "at 34th St NW",
                "postalCode": "20007",
                "state": "D.C."
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.002583742142,
                    38.887041080933
                ]
            },
            "properties": {
                "phoneFormatted": "(202) 547-9338",
                "phone": "2025479338",
                "address": "221 Pennsylvania Ave SE",
                "city": "Washington DC",
                "country": "United States",
                "crossStreet": "btwn 2nd & 3rd Sts. SE",
                "postalCode": "20003",
                "state": "D.C."
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -76.933492720127,
                    38.99225245786
                ]
            },
            "properties": {
                "address": "8204 Baltimore Ave",
                "city": "College Park",
                "country": "United States",
                "postalCode": "20740",
                "state": "MD"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.097083330154,
                    38.980979
                ]
            },
            "properties": {
                "phoneFormatted": "(301) 654-7336",
                "phone": "3016547336",
                "address": "4831 Bethesda Ave",
                "cc": "US",
                "city": "Bethesda",
                "country": "United States",
                "postalCode": "20814",
                "state": "MD"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.359425054188,
                    38.958058116661
                ]
            },
            "properties": {
                "phoneFormatted": "(571) 203-0082",
                "phone": "5712030082",
                "address": "11935 Democracy Dr",
                "city": "Reston",
                "country": "United States",
                "crossStreet": "btw Explorer & Library",
                "postalCode": "20190",
                "state": "VA"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.10853099823,
                    38.880100922392
                ]
            },
            "properties": {
                "phoneFormatted": "(703) 522-2016",
                "phone": "7035222016",
                "address": "4075 Wilson Blvd",
                "city": "Arlington",
                "country": "United States",
                "crossStreet": "at N Randolph St.",
                "postalCode": "22203",
                "state": "VA"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -75.28784,
                    40.008008
                ]
            },
            "properties": {
                "phoneFormatted": "(610) 642-9400",
                "phone": "6106429400",
                "address": "68 Coulter Ave",
                "city": "Ardmore",
                "country": "United States",
                "postalCode": "19003",
                "state": "PA"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -75.20121216774,
                    39.954030175164
                ]
            },
            "properties": {
                "phoneFormatted": "(215) 386-1365",
                "phone": "2153861365",
                "address": "3925 Walnut St",
                "city": "Philadelphia",
                "country": "United States",
                "postalCode": "19104",
                "state": "PA"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.043959498405,
                    38.903883387232
                ]
            },
            "properties": {
                "phoneFormatted": "(202) 331-3355",
                "phone": "2023313355",
                "address": "1901 L St. NW",
                "city": "Washington DC",
                "country": "United States",
                "crossStreet": "at 19th St",
                "postalCode": "20036",
                "state": "D.C."
            }
        }
    ]
};

stores.features.forEach((store, i) => {
    store.properties.id = i;
});

const news = {
    "11": {
        "11381": [
            {
                "publishedAt": "2023-01-01T10:00:00Z",
                "author": "BCN＋R",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/7/0/7004e_1562_0a270bfb_c0ee03fd.jpg",
                "description": "住宅ローン専門金融機関のアルヒは、自社データをもとに住宅専門家が厳選した1都3県（東京・神奈川・埼玉・千葉）の「本当に住みやすい街」のランキング「ARUHI presents 本当に住みやすい街大賞2023」を2022年12",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "「本当に住みやすい街大賞2023」1位はJR中央本線の西八王子が獲得",
                "url": "https://news.livedoor.com/article/detail/23473212/",
                "content": "13ARUHI presents 202320221215ARUHI\r\n222023101JR3.854.131\r\n24.033JR3.8643.7351JR4.243.69\r\n6101IC 1225\r\n8JR123318TJ\r\n23 24232024BCN"
            }
        ],
        "11383": [
            {
                "publishedAt": "2023-01-06T17:56:00Z",
                "author": null,
                "urlToImage": "https://img.news.goo.ne.jp/image_proxy/compress/q_80/picture/asahi/s_ASR1710BYR16UTNB020.jpg",
                "description": "埼玉県狭山市広瀬台1丁目のマンション近くで6日夜、50代の男性が銃撃されたとみられる事件で、県警は7日未明、男性がマンションの住民で職業不詳の鈴木頼一（よりかず）さ...",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "銃撃された男性死亡　犯人は逃走",
                "url": "https://news.goo.ne.jp/topstories/nation/1000/8f27aec5ed47fc8f0cf372ad3c6ebd94.html?fr=RSS",
                "content": "() 2023/01/07 03:20\r\n=20231610531\r\n()\r\n1650755"
            },
            {
                "publishedAt": "2023-01-06T04:40:03Z",
                "author": "埼玉県戸田市",
                "urlToImage": "https://prtimes.jp/i/76954/243/ogp/d76954-243-873033-pixta_82544383-0.jpg",
                "description": "[埼玉県戸田市]\n埼玉県戸田市では、毎月１日に発行している『広報戸田市』の見どころを１分間で紹介する動画をYouTubeショートで配信する取り組みを始めました。\n広報紙には市が実施している施策やイベントなどを紹介する特集ペ...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "YouTubeショートで『広報戸田市』の見どころを毎月紹介します",
                "url": "https://prtimes.jp/main/html/rd/p/000000243.000076954.html",
                "content": ""
            }
        ],
        "11108": [
            {
                "publishedAt": "2022-12-31T19:33:08Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230101/K10013939271_2212311959_1231211728_01_02.jpg",
                "description": "埼玉県飯能市で親子3人が殺害された事件から1日で1週間になります。容疑者は事件について供述をしておらず、警察は自宅から押収した資料を分析するなどして事件のいきさつを調べることにしています。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "埼玉 親子3人殺害事件1週間 容疑者供述せず いきさつ調べる",
                "url": "https://www3.nhk.or.jp/news/html/20230101/k10013939271000.html",
                "content": "311"
            },
            {
                "publishedAt": "2022-12-30T12:40:00Z",
                "author": null,
                "urlToImage": "https://articleimage.nicoblomaga.jp/image/279/2022/3/c/3c273991fead134eb80ad9316df324b46730ff531672403896.jpg",
                "description": "1：2022/12/30(金) 19:59:02.82ID:eyQqZcJ1d埼玉県川口市のバーで、6年前、従業員の男性を殺害した罪にとわれている、元暴力団組員の男に対して、さいたま地裁は懲役20年の判決を言い渡した。男にとって、被害者は、娘の\u201d元カレ\u201d。法廷で語られたのは、壮絶な暴行シーンだった。特定抗争指定暴力団・山口組系元組員の島田一治被告（55）は、2016年3月、仲間のA男とともに、川口",
                "source": {
                    "name": "Alfalfalfa.com",
                    "id": null
                },
                "title": "【閲覧注意】元ヤクザのマグロ卸社長、娘の元彼にキレて暴行殺害、冷凍倉庫で凍らせて解体焼却処分し完全犯罪達成",
                "url": "http://alfalfalfa.com/articles/333803.html",
                "content": "https://t.co/n7cLp4O1xT #\r\n \u2014 (@alfalfaGeinow) 20221230"
            },
            {
                "publishedAt": "2023-01-08T06:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230106004762_comm.jpg",
                "description": "2020年10月の休日、社会福祉士の楢府（ならふ）憲太さん（40）は、東武東上線の川越駅（埼玉県川越市）にいた。　改札を出てすぐのコンコースで、数人の通行人が集まり、心配そうな様子で上を見上げていた\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "駅の天井から石膏ボードがドスン　鉄道施設の落下物、3年で184件",
                "url": "https://www.asahi.com/articles/ASR166F2FR16UTIL01L.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-06T05:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/29869/363/ogp/d29869-363-b54244d0d6b95b897551-0.jpg",
                "description": "[ケイアイスター不動産株式会社]\n　ケイアイスター不動産株式会社（本社／埼玉県本庄市、代表取締役／塙　圭二、以下「当社」と言う。）は、ニチハ株式会社（本社／愛知県名古屋市、代表取締役社長／吉岡　成充）が主催する第39回NICHIHA SIDING ...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "ニチハ株式会社主催第39回NICHIHA SIDING AWARD 2022「離れない離れと通り土間がある家」が受賞",
                "url": "https://prtimes.jp/main/html/rd/p/000000363.000029869.html",
                "content": "39NICHIHA SIDING AWARD2022 2022753\r\nNa-view39NICHIHA SIDING AWARD2022https://www.nichiha.co.jp/info/naview_vol471.pdf\r\nMGMGAR\r\n10\r\n39NICHIHA SIDING AWARD 2022\r\n2022753\r\n×KEIAIDX11175,400()()202231,84\u2026 [+262 chars]"
            }
        ],
        "11229": [
            {
                "publishedAt": "2023-01-05T02:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/22446/111/ogp/d22446-111-d437d4487c0d82d44c00-0.png",
                "description": "[アルビレックス新潟シンガポール]\n[画像: https://prtimes.jp/i/22446/111/resize/d22446-111-d437d4487c0d82d44c00-0.png ]\n\nプロフィール\n\n氏名\n高橋 亮 (たかはし りょう)\n\nポジション\nDF\n\n生年月日\n2000年7月11日 (22歳)\n\n出身地\n埼玉県\n\n身長...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "高橋 亮選手 東洋大学より加入内定のお知らせ",
                "url": "https://prtimes.jp/main/html/rd/p/000000111.000022446.html",
                "content": "( )\r\nDF\r\n2000711 (22)\r\n / \r\n178cm / 75kg\r\nFC →FCU-15 →FCU-18 →\r\n[ : ]\r\n<ol><li> &gt;<\/li><li> &gt;<\/li><li><\/li><\/ol>"
            }
        ],
        "11107": [
            {
                "publishedAt": "2023-01-08T01:15:12Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/f/7/f7185dca-s.png",
                "description": "1: リバースネックブリーカー(埼玉県) [CO]  2022/11/07(月) 13:52:00.62 ID:HyM9DZZq0● BE:943634672-2BP(2999)  sssp://img.5ch.net/ico/003.gif  >>11/3(木) 15:54配信  週刊SPA!    　例えば部下の女性社員から「〇〇さんってモテますよね？」というように、仮に社交辞",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "「女性に優しくされただけで好きになってしまう男」共通する３つの傾向ｗｗｗｗｗ",
                "url": "http://news4vip.livedoor.biz/archives/52475574.html",
                "content": "1: () [CO] 2022/11/07() 13:52:00.62 ID:HyM9DZZq0 BE:943634672-2BP(2999)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1667796720/"
            },
            {
                "publishedAt": "2023-01-05T06:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/45234/604/ogp/d45234-604-c6ab8d6f98a16a034064-0.jpg",
                "description": "[株式会社石川ツエーゲン]\n須藤 直輝 / Naoki SUTOH プロフィール\n\n[画像1: https://prtimes.jp/i/45234/604/resize/d45234-604-c6ab8d6f98a16a034064-0.jpg ]\n\n■ポジション\nMF\n\n■生年月日\n2002年10月1日\n\n■出身地\n埼玉県\n\n■身長/体重\n169c...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "須藤直輝選手 育成型期限付き移籍期間満了のお知らせ",
                "url": "https://prtimes.jp/main/html/rd/p/000000604.000045234.html",
                "content": "/ Naoki SUTOH \r\nMF2002101\r\n/169cm/63kg\r\nJr - - - ()\r\nJ215(0)2(0)\r\n1\r\n<ol><li> &gt;<\/li><li> &gt;<\/li><li><\/li><\/ol>"
            },
            {
                "publishedAt": "2023-01-02T02:00:00Z",
                "author": "高橋 ユキ",
                "urlToImage": "https://bunshun.jp/mwimgs/6/0/1200wm/img_6021b009bb6a7acdb4087d68488d775758013.jpg",
                "description": "埼玉県川越市に住んでいた浄化槽点検管理業、Tさん（59＝当時）が、突然姿を消したのは2011年6月。家族が8月に捜索願を出したが、行方は分からないまま。自らの意志で姿を消したのか、あるいは事件なのか、\u2026",
                "source": {
                    "name": "Bunshun.jp",
                    "id": null
                },
                "title": "元妻の父親を撲殺したのち「遺体を食べた」と供述\u2026犯人が法廷で語った\u201c身勝手すぎる動機\u201dとは\u2015\u2015平成事件史",
                "url": "https://bunshun.jp/articles/-/59334",
                "content": "T59201168\r\n120126T\r\nT46T\r\n©iStock.com\r\n5T\r\nT\r\nT220136TTT\r\nT"
            },
            {
                "publishedAt": "2023-01-06T12:33:20Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230106/K10013943501_2301062145_0106214833_01_02.jpg",
                "description": "消防によりますと、6日午後7時すぎ埼玉県狭山市で「夫がけん銃で胸を撃たれた」と119番通報が入りました。警察官や消防隊員が現場にかけつけると、狭山市の集合住宅の敷地内で50歳代ぐらいの男性が上半身から血を流して倒れていて、病院に搬送されました。消防によりますと搬送時、男性には意識があり、話せる状態だったということです。警察は、現場から容疑者がけん銃を持ったまま逃走している可能性があるとして、周辺の住民に戸締まりをして不審な人物を見かけたら、警察にすぐに連絡するよう呼びかけています。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "埼玉 狭山の集合住宅の敷地内で男性が拳銃で撃たれけがか",
                "url": "https://www3.nhk.or.jp/news/html/20230106/k10013943501000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-06T11:09:17Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230106/K10013943311_2301061958_0106200919_01_02.jpg",
                "description": "3年前、埼玉県八潮市で給食を食べた小中学生など3400人余りが下痢や腹痛などの症状を訴えた集団食中毒で、警察は給食を調理した会社の役員など3人を業務上過失傷害の疑いで書類送検したことが、捜査関係者への取材でわかりました。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "小中学生ら3400人余の集団食中毒で給食調理会社の3人書類送検",
                "url": "https://www3.nhk.or.jp/news/html/20230106/k10013943311000.html",
                "content": ""
            }
        ],
        "11228": [
            {
                "publishedAt": "2023-01-06T12:59:23Z",
                "author": null,
                "urlToImage": "https://blogimg.goo.ne.jp/user_image/00/20/7cabf0d9bcc77f475e29854a026818e8.jpg",
                "description": "これからもぜひ一日一回、上下ともクリックしてくださると大変うれしいです！！！\n\nにほんブログ村\n社会・経済ニュースランキング\n\nAmazon　社会・政治・法律\nAｍazon　Kindle　ベストセラー\n \n \n　ＴＢＳやＮＨＫによりますと、２０２３年１月６日に厚生労働省が発表した新型コロナウイルスによる全国の死者数は４５６人で、去年１２月２９日の４２０人を上回って、一日の発表としては、これまでで最も多くなりました。\n　もっとも、読売新聞によると昨日５日、新型コロナウイルスの者は４９８人で、昨年１２月２７日の４３８\u2026",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "１月６日に厚生労働省が発表した新型コロナウイルスによる全国の死者数は４５６人で過去最多。死者数の波のピークが来るのはまだ１月中旬から下旬。コロナ棄民政策の岸田内閣は総辞職せよ。",
                "url": "https://blog.goo.ne.jp/raymiyatake/e/fcad493828cf7049d98a63aeca3f9551",
                "content": "6\r\n3004437724554240677292720260193815957202903211773189159515928164656311429141798014859132486957813089741221012520245713723873847168779480466148794212554402524255101420764796743960472547571746980949\u2026 [+315 chars]"
            },
            {
                "publishedAt": "2023-01-05T09:40:02Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/47262/74/ogp/d47262-74-311d6ae02ce53c8e5105-0.jpg",
                "description": "[一般社団法人埼玉県物産観光協会]\n毎年ご好評の、埼玉の歴史を辿るツアーを再び開催！\n\n埼玉古墳群では歩いて登れる古墳を学芸員さんの解説付きで巡り、れきしクン（長谷川ヨシテルさん）のナビゲートで忍城址を見学した後は忍城おもてなし甲冑隊...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "埼玉歴史ツアー【行田の古代・戦国二大ロマンツアー】（「２０２３ 全国版 旅して！埼玉割」適用商品）予約受付中！",
                "url": "https://prtimes.jp/main/html/rd/p/000000074.000047262.html",
                "content": "()\r\n/\r\n()\r\n20232189,80012,250\r\n202,4501,000\r\nhttps://chocotabi-saitama-store.jp/archives/activity/465381\r\nDMO2TEL048-871-6984FAX048-871-698510:0017:00Mail: tour@saitamadmo.org"
            },
            {
                "publishedAt": "2023-01-05T02:30:54Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/a/7/a754846d-s.png",
                "description": "1: クロアシネコ(埼玉県) [CO]  2023/01/04(水) 10:39:35.75 ID:OanyPqpw0● BE:952977951-2BP(2000)  sssp://img.5ch.net/ico/foruda.gif  EXITが\u201c重大発表\u201d　YouTube終了の可能性にファンは涙「辛すぎる」「心臓バクバク」    お笑いコンビ・EXITが3日にYouTubeチャンネ",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "EXIT「重大発表あります\u2026」 ファンは涙「辛すぎる」「心臓バクバク」 → 結果ｗｗｗｗｗ",
                "url": "http://news4vip.livedoor.biz/archives/52475318.html",
                "content": "1: () [CO] 2023/01/04() 10:39:35.75 ID:OanyPqpw0 BE:952977951-2BP(2000)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1672796375/"
            }
        ],
        "11349": [
            {
                "publishedAt": "2023-01-06T12:03:08Z",
                "author": "集英社オンライン",
                "urlToImage": "https://newsatcl-pctr.c.yimg.jp/t/amd-img/20230106-00010005-shueisha-000-1-view.jpg?exp=10800",
                "description": "昨年12月25日朝、埼玉県飯能市美杉台の住宅街で森田泉さん（68）と夫で米国籍のビショップ・ウィリアム・ロス・ジュニアさん（69）、二人の娘で会社員の森田ソフィアナ恵さん（32）の親子3人が、ハンマーのような鈍器で殺害された事件で、1月4日、斎藤淳容疑者（40）はビショップさんへの殺人容疑で送検された。埼玉県警...",
                "source": {
                    "name": "Yahoo.co.jp",
                    "id": null
                },
                "title": "母から月5万円の仕送り、庭で人参を栽培、弁護士からは「家からとにかく出て行ってほしい」\u2026「飯能親子3人殺害事件」斎藤淳容疑者（40）の節約\u201cぼっち\u201d生活（集英社オンライン） - Yahoo!ニュース",
                "url": "https://news.yahoo.co.jp/articles/0a37ca04ce3ca390898f777fe77e8139a3505467",
                "content": "- - - - - - - Copyright © 2023 SHUEISHA INC. ALL RIGHTS RESERVED. \r\n©Yahoo Japan"
            },
            {
                "publishedAt": "2023-01-04T02:40:03Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/22446/108/ogp/d22446-108-cf9e03020a6ddaa4493c-0.png",
                "description": "[アルビレックス新潟シンガポール]\nプロフィール\n\n[画像: https://prtimes.jp/i/22446/108/resize/d22446-108-cf9e03020a6ddaa4493c-0.png ]\n\n氏名\n岸本 駿朔 (きしもと しゅんさく)\n\nポジション\nDF\n\n生年月日\n2000年6月14日 (22歳)\n\n出身地\n埼玉県...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "岸本 駿朔選手 拓殖大学より加入内定のお知らせ",
                "url": "https://prtimes.jp/main/html/rd/p/000000108.000022446.html",
                "content": "( )\r\nDF\r\n2000614 (22)\r\n / \r\n182cm / 80kg\r\nFC→→→\r\n20232\r\n[ :]\r\n<ol><li> &gt;<\/li><li> &gt;<\/li><li><\/li><\/ol>\r\nURL\r\nhttps://www.albirex.com.sg/news/43060/"
            },
            {
                "publishedAt": "2023-01-06T15:00:47Z",
                "author": "htmk701",
                "urlToImage": "https://livedoor.blogimg.jp/hatima/imgs/e/7/e72fb558.jpg",
                "description": "【注意】埼玉県狭山市で男性が銃で撃たれ搬送\u2026容疑者は拳銃を持ったまま逃走した可能性の記事ページ",
                "source": {
                    "name": "Esuteru.com",
                    "id": null
                },
                "title": "【注意】埼玉県狭山市で男性が銃で撃たれ搬送\u2026容疑者は拳銃を持ったまま逃走した可能性",
                "url": "http://blog.esuteru.com/archives/9988973.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-02T23:30:02Z",
                "author": "kurrism",
                "urlToImage": "https://livedoor.blogimg.jp/kurrism/imgs/6/7/67357cf1.png",
                "description": "532: U-名無しさん＠＼(^o^)／ ID:6UIcjSdY0  神奈川さん今年の高校サッカーもダメだったか    関東勢優勝回数  埼玉県☆☆☆☆☆☆☆☆☆☆☆☆☆  千葉県☆☆☆☆☆☆☆☆  東京都☆☆☆☆☆☆  茨城県☆☆  栃木県☆  群馬県☆  神奈川県  引用元: https://kizuna.5ch.net",
                "source": {
                    "name": "Worldfn.net",
                    "id": null
                },
                "title": "◆悲報◆関東で高校サッカーで優勝できないのは神奈川県だけ、今年も既に敗退",
                "url": "https://worldfn.net/archives/60072502.html",
                "content": "<table><tr><th>[Sponsored Link]\r\n <\/th><th>[Sponsored Link]\r\n <\/th><\/tr><tr><th><\/th><\/tr>\r\n<th><\/th>\r\n<\/table>\r\n546: U-(^o^) ID:kiVjGBvi0\r\n548: U-(^o^) ID:9NeajUZhd\r\n551: U-(^o^) ID:kiVjGBvi0\r\n817: \u2026 [+46 chars]"
            }
        ],
        "11109": [
            {
                "publishedAt": "2022-12-31T00:30:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/7/9/79528_1509_327fa92a_84bb1a9c.jpg",
                "description": "千葉県や市町村の相談窓口などで2021年度に受け付けた移住相談は5197件に上り、新型コロナウイルスの感染が広がる前の19年度の2681件から倍増した。総務省のまとめでわかった。テレワークが浸透して働き方を見直す人が増え、移住への関心が高まったとみられる。県内への移住相談件数はコロナ禍の20年度も4591件で、前年度に比べると約2千件増えた。21年度の5197件は、首都圏の神奈川県（4197件）や埼玉県（3035件）を上回った。全国でも32万件を超え、前年度より約3万3千件多く、 全文朝日新聞デジタル 12月31\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "千葉への移住相談、コロナ前から倍増5197件　南房総地域が人気",
                "url": "https://news.livedoor.com/article/detail/23467231/",
                "content": "20215197192681\r\n204591221519741973035323315\r\n2\r\n19604\r\n65411\r\n513070"
            }
        ],
        "11221": [
            {
                "publishedAt": "2022-12-30T07:10:27Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221230002255_comm.jpg",
                "description": "東京都世田谷区の会社員、宮澤みきおさん（当時44）方で一家4人が殺害された事件は、未解決のまま22年が経った。宮澤さんの母、節子さん（91）は30日、埼玉県新座市で4人が眠る墓に花を手向け、手を合わ\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "「なぜかを知ってから死にたい」　世田谷一家殺害22年、遺族墓参り",
                "url": "https://www.asahi.com/articles/ASQDZ4R20QDZUTIL008.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-05T22:45:43Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230106000909_comm.jpg",
                "description": "埼玉県幸手市教育委員会は5日、2018年度に市立中学1年（当時）の女子生徒が自殺を図ったことについて、いじめ防止対策推進法に基づく第三者委員会の調査報告書を公表した。三者委は同級生らによるいじめがあ\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "LINEでいじめ、中1女子「死にたい」　自殺未遂との関連を認定",
                "url": "https://www.asahi.com/articles/ASR157QSDR15UTNB009.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            }
        ],
        "11342": [
            {
                "publishedAt": "2023-01-05T09:40:02Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/9436/134/ogp/d9436-134-c3d8fcc550e44c204c9b-0.jpg",
                "description": "[ポラス株式会社]\nポラスグループ (株)中央住宅（本社：埼玉県越谷市、代表取締役社長：品川典久）の山下隆史が設計した「K HOUSE」（フ レーベスト上福岡ライフコネクションのモデルハウス）が、海外のデザインアワード『GERMAN D...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "国際的デザインアワード『GERMAN DESIGN AWARD』 「K HOUSE」が ポラスグループ初となる《Special Mention（特別賞）》を受賞！",
                "url": "https://prtimes.jp/main/html/rd/p/000000134.000009436.html",
                "content": "()K HOUSE GERMAN DESIGN AWARD 2023/Special MentionK HOUSE 2022 10 MUSE Design Awards 2  \r\n1953 GERMAN DESIGN AWARD 2012 1969 // 3 60 4,500 GERMAN DESIGN AWARD 2023 2023 2 GERMAN DESIGN AWARDhttps://w\u2026 [+285 chars]"
            }
        ],
        "11341": [
            {
                "publishedAt": "2023-01-06T02:30:00Z",
                "author": "gurum22",
                "urlToImage": "http://www.gurum.biz/wp-content/uploads/2023/01/2_s-640x359-1.jpg",
                "description": "1 名前：ヨーロッパヤマネコ(埼玉県) [CO] 投稿日：2023/01/06 8:18:43 ID:5レトルト温め専用調理器「レトルト亭」も10%OFF! 「Amazon 初売り」が開催中～ガスもお湯もラップも使わない、レトルト調理革命\n\n　Amazonが、毎年恒例の年始のビッグセール「Amazon 初売り」を2023年1月3日(火)9時～1月7日(土)23時59分までの5日間開催していますが、アピックスインターナショナルの「ガス」も「お湯」も「ラップ」も使わない、レトルト専用調理器の「レトルト亭」(ARM-1\u2026",
                "source": {
                    "name": "Gurum.biz",
                    "id": null
                },
                "title": "【これは便利】お湯を使わずレトルトを温められる機器が発売",
                "url": "http://www.gurum.biz/archives/100237923.html",
                "content": "Copyright All Rights Reserved."
            },
            {
                "publishedAt": "2023-01-05T04:30:00Z",
                "author": null,
                "urlToImage": "https://articleimage.nicoblomaga.jp/image/279/2023/b/3/b38e061297cd0e30d63d00bde7f3a8ee1ea6ded61672892437.jpg",
                "description": "1：2023/01/05(木) 12:01:48.78ID:6OZwxrhX0https://www3.nhk.or.jp/news/html/20230104/k10013940721000.html先月のクリスマスに埼玉県飯能市で親子3人が殺害された事件で、近くに住む容疑者の自宅で押収された血の付いた衣類から、被害者3人のDNA型が検出されたことが、警察への取材で分かりました。容疑者は「自分は",
                "source": {
                    "name": "Alfalfalfa.com",
                    "id": null
                },
                "title": "【驚愕】飯能市ハンマー男、パソコンやスマホを持たずに引きこもり生活をしていた",
                "url": "http://alfalfalfa.com/articles/334072.html",
                "content": "https://t.co/IAZLWfby09 #\r\n \u2014 (@alfalfaGeinow) 202315"
            },
            {
                "publishedAt": "2023-01-08T02:00:16Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/e/9/e9c35b0d-s.jpg",
                "description": "1: ヨーロッパヤマネコ(埼玉県) [CO]  2023/01/06(金) 14:23:15.56 ID:OmYAmYIW0● BE:943634672-2BP(2999)  sssp://img.5ch.net/ico/003.gif  ■秋元康氏　1日3時間睡眠で「全然眠くない」　47年間オフは「ない」とキッパリ    　作詞家でプロデューサーの秋元康氏（64）が5",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "【これマジ？】秋元康さん、ショートスリーパーだった！１日３時間睡眠ｗｗｗｗｗ",
                "url": "http://news4vip.livedoor.biz/archives/52475555.html",
                "content": "1: () [CO] 2023/01/06() 14:23:15.56 ID:OmYAmYIW0 BE:943634672-2BP(2999)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1672982595/"
            }
        ],
        "11385": [
            {
                "publishedAt": "2023-01-04T02:12:26Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230104001215_comm.jpg",
                "description": "埼玉県飯能市の住宅で昨年12月、親子3人が殺害された事件で、このうち1人に対する殺人未遂容疑で逮捕された近くの斎藤淳容疑者（40）=殺人容疑で送検=の自宅から衣類が押収され、被害者のDNA型が検出さ\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "容疑者の衣類から被害者のDNA型検出　埼玉・飯能の親子3人殺害",
                "url": "https://www.asahi.com/articles/ASR143JKWR14UTNB001.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-05T07:16:45Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "\u201d三郷市の店舗・企業の活性化と、次世代を担う若者たちにワクワクを\u201dのコンセプトのもと、地域と若者世代のユーザーをつなぎ、新たな価値の共創を目指します。株式会社SOUZOUDO（本社：東京都中央区、代表取締役：鈴木優作）が立ち上げた埼玉県三郷市のまちづくりプロジェクト「GATE3310」は、2023年1月5日（木）、新成...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社SOUZOUDO【埼玉県三郷市初】新成人を対象に、市内の飲食店等で使える特典を配信するLINE公式アカウント『YOUTH 3310』をリリースしました。",
                "url": "https://japan.cnet.com/release/30817386/",
                "content": "SOUZOUDOGATE3310202315LINEYOUTH3310\r\n[1: ]\r\nNPO 2\r\n3\u201d\u201dGATE3310\r\n2023[2: ]\r\nYOUTH3310LINE\r\nLINE\r\n[3: ]\r\nYOUTH331020024220044120\r\nYOUTH3310 LINE\r\nGATE3310\r\nGATE33102022112\r\nGATE3310 Web\r\nSOUZOUDOE-mail\u2026 [+42 chars]"
            }
        ],
        "11102": [
            {
                "publishedAt": "2023-01-08T06:00:39Z",
                "author": "nwknews",
                "urlToImage": "https://livedoor.blogimg.jp/nwknews/imgs/e/1/e183e8b5.jpg",
                "description": "1: ハイイロネコ(埼玉県) [CO] 2023/01/08(日) 10:11:01.37 ID:pVetXiPO0● BE:952977951-2BP(2000)【画像】葛飾北斎が90歳超えて描いた鮭の塩焼きｗｗｗｗｗｗｗｗｗｗ\n■「これは泳ぐお寿司じゃん\u2026」水族館でのビジュアルにSNS騒然！「海老のお寿司でしょ」「ボイルして...",
                "source": {
                    "name": "Livedoor.jp",
                    "id": null
                },
                "title": "お寿司みたいな生き物が発見されるｗｗｗｗｗｗｗｗｗ",
                "url": "http://blog.livedoor.jp/nwknews/archives/6004007.html",
                "content": "zarathustra1116@yahoo.co.jp"
            },
            {
                "publishedAt": "2023-01-05T02:00:00Z",
                "author": "honwaka2ch",
                "urlToImage": "https://livedoor.blogimg.jp/honwaka2ch/imgs/7/e/7e3c1dad-s.jpg",
                "description": "44 名前：シャム(千葉県) [US][sage] 投稿日：2023/01/04(水) 16:34:24.77誰が一番稼いだんだ？投資とかは抜きで58 名前：ボンベイ(群馬県) [FR][sage] 投稿日：2023/01/04(水) 16:38:58.79>>44マイケルジョーダンやろ59 名前：イエネコ(埼玉県) [ZA][sage] 投稿日：2023/01/...",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "アスリートで誰が一番稼いだんだ？ 投資とかは抜きで",
                "url": "http://honwaka2ch.livedoor.biz/archives/10207192.html",
                "content": "44 () [US][sage] 2023/01/04() 16:34:24.7758 () [FR][sage] 2023/01/04() 16:38:58.79&gt;&gt;44\r\n59 () [ZA][sage] 2023/01/04() 16:39:05.63&gt;&gt;44\r\n67 () [][] 2023/01/04() 16:40:49.52&gt;&gt;44\r\n101 (\u2026 [+302 chars]"
            },
            {
                "publishedAt": "2023-01-08T01:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221226002959_comm.jpg",
                "description": "昨年11月下旬、東京・秋葉原の喫茶店で埼玉県草加市の女性（32）が夫への不満を吐き出していた。　「『子育てなんて知ったこっちゃねえよ』って言われて、カチンときちゃった」　女性は勤めていたスポーツジム\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "さばくべき人間関係が多すぎる　陥る孤立のすき間埋めるのはレンタル",
                "url": "https://www.asahi.com/articles/ASQDV5QWFQDJPLFA00C.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            }
        ],
        "11223": [
            {
                "publishedAt": "2023-01-05T06:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "確かな品質でハイパフォーマンスPCの製造を行うパソコンメーカーの株式会社サイコム（本社:埼玉県八潮市／代表取締役:河野 孝史）は、インテル社のデスクトップ向け第13世代Core(TM) プロセッサー「Raptor Lake-S」の新ラインナップ8製品を、当社の各モデルで搭載可能とし本日1月5日（木）より販売開始します。搭載可能...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社サイコム第13世代 インテル(R) Core(TM) プロセッサーの新ラインナップに対応！標準搭載モデルからオプション選択での搭載モデルなど1月5日（木）15時より販売開始",
                "url": "https://japan.cnet.com/release/30817189/",
                "content": "PC:: 13Core(TM) Raptor Lake-S815\r\nIntel(R) Core(TM) i3-13100Intel(R) Core(TM) i5-13400FIntel(R) Core(TM) i5-13400Intel(R) Core(TM) i5-13500Intel(R) Core(TM) i7-13700FIntel(R) Core(TM) i7-13700Intel(R\u2026 [+1024 chars]"
            }
        ],
        "11465": [
            {
                "publishedAt": "2023-01-06T07:20:21Z",
                "author": "サッカーキング",
                "urlToImage": "https://www.soccer-king.jp/wp-content/uploads/2023/01/mori-27.jpg",
                "description": "MF矢島慎也が大宮アルディージャからレノファ山口FCに完全移籍した。6日、両クラブが公サイトで発表した。　矢島は1994年1月18日生まれで埼玉県出身。浦和レッズの育成組織で育ち、2012年にデビューを飾った。ファジアーノ岡山へと期限付き移籍していた2016年には、リオデジャネイロオリンピックのU－23日本代表メンバーに選出されたこともある。　2018年に浦和からG大阪へと完全移籍し、同シー...",
                "source": {
                    "name": "Soccer-king.jp",
                    "id": null
                },
                "title": "MF矢島慎也、大宮から山口に完全移籍「1つでも多く試合に勝てるように全力で頑張ります」",
                "url": "https://www.soccer-king.jp/news/japan/jl/20230106/1727941.html",
                "content": "MFFC6\r\n199411820122016U23\r\n2018G20193G2022J2384\r\nFC1"
            },
            {
                "publishedAt": "2023-01-06T23:46:49Z",
                "author": "フルカウント",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/0/3/03e2d_1397_161ef375_3225b778.jpg",
                "description": "大学時代は山崎から贈られたグラブ愛用「これからはお守りとして」西武のドラフト4位ルーキーで即戦力右腕の亜大・青山美夏人（みなと）投手が6日、埼玉県所沢市内の若獅子寮に入寮。「俺は亜細亜だ」と大書された赤いタオルと、使い込まれた黒いグラブを持参していた。タオルは亜大野球部引退後にOBが製作してくれたもの。グラブは大学1年の夏、亜大の大先輩にあたるDeNA・山崎康晃投手から贈られたもので、その秋に東都大学リーグでデビューを飾って以降、試合ではずっと使い続 全文フルカウント 01月07日08時46分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "「野球＝丸刈り」から卒業　西武ドラ4、イメチェン参考の「凄く印象的」な先輩は？",
                "url": "https://news.livedoor.com/article/detail/23497180/",
                "content": "46\r\nOB1DeNA\r\nNPB12OB\r\n12151 / Hirohisa Miyawaki"
            },
            {
                "publishedAt": "2023-01-07T06:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230107001343_comm.jpg",
                "description": "1976年12月24日、イブがクリスマスに変わろうとする真夜中の出来事だった。　33歳の電気工事士だった八木下征男（ゆきお）は埼玉県内の現場で別の場所へと移動するトラックを待っていた。　寒さに震えな\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "伝説を生んだ一枚の「歩」　将棋道場席主と少年の半世紀",
                "url": "https://www.asahi.com/articles/ASR173FW4R12UCVL00Q.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2022-12-30T12:00:27Z",
                "author": "kakaotoko80",
                "urlToImage": "https://livedoor.blogimg.jp/creca_ex/imgs/7/3/7315472c-s.png",
                "description": "1: ぐれ ★  2022/12/28(水) 15:39:27.64 ID:WkLKilYE9  >>12/26(月) 21:43配信  集英社オンライン    埼玉県飯能市美杉台の住宅街で25日朝、60代の夫婦と30代の娘の3人が自宅で惨殺された。被害者がハンマーのような鈍器で襲われる様子を近所の住民が目撃して複数通報、埼玉",
                "source": {
                    "name": "Doorblog.jp",
                    "id": null
                },
                "title": "【悲報】『飯能殺害事件』「昔はサッカーがうまくてモテていたのに」逮捕された無職男（40）は一家離散　\u201cぼっち\u201dのひきこもり",
                "url": "http://money-life.doorblog.jp/archives/57224957.html",
                "content": "1: 2022/12/28() 15:39:27.64 ID:WkLKilYE9\r\n40\r\n61: 2022/12/28() 16:13:28.03 ID:1h7zTix70\r\n62: 2022/12/28() 16:13:36.93 ID:B9DjG7FW0\r\n3: 2022/12/28() 15:42:13.15 ID:CdctqXOZ0\r\n4: 2022/12/28() 15:43:48.\u2026 [+2125 chars]"
            }
        ],
        "11101": [
            {
                "publishedAt": "2023-01-07T12:02:20Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230107/K10013944011_2301071937_0107210222_01_02.jpg",
                "description": "6日夜、埼玉県狭山市で暴力団員とみられる男性が拳銃で撃たれ殺害された事件で、男性は外出先から車で帰ってきた直後に襲われたとみられることがわかり、警察は容疑者が待ち伏せをしていた可能性もあるとみて詳しい状況を調べています。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "埼玉 男性銃撃事件 帰宅直後に襲われたか 待ち伏せの可能性も",
                "url": "https://www3.nhk.or.jp/news/html/20230107/k10013944011000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-04T08:13:56Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230104/K10013941041_2301041712_0104171357_01_02.jpg",
                "description": "厚生労働省によりますと、4日に発表した国内の新たな感染者は、空港の検疫などを含め10万4304人となっています。また国内で亡くなった人は、東京都で22人、大阪府で20人、神奈川県で17人、福岡県で16人、熊本県で15人、北海道で14人、愛知県で10人、千葉県で9人、宮崎県で9人、栃木県で7人、群馬県で7人、香川県で6人、高知県で6人、三重県で4人、岐阜県で4人、岡山県で4人、岩手県で4人、徳島県で4人、秋田県で4人、京都府で3人、兵庫県で3人、宮城県で3人、福井県で3人、長崎県で3人、佐賀県で2人、和歌山県で2人\u2026",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "【新型コロナ 厚労省まとめ】218人死亡 10万4304人感染 (4日)",
                "url": "https://www3.nhk.or.jp/news/html/20230104/k10013941041000.html",
                "content": "4104304\r\n222017161514109977664444443333322222222211121858162\r\n4\r\n29571931104304402627415542572097255200657165671862493582916244274991139464580130734403512890803379124729250070931243116757863698607482\u2026 [+370 chars]"
            },
            {
                "publishedAt": "2023-01-05T10:30:57Z",
                "author": "himasoku123",
                "urlToImage": "https://livedoor.blogimg.jp/himasoku123/imgs/e/4/e4c5edae-s.jpg",
                "description": "1: ヤマネコ(埼玉県) [CO] 2023/01/05(木) 10:23:31.72 ID:pKzizopM0● BE:971946189-2BP(3000)\n大雪で「秋田犬の手も借りたい」→酒屋の看板犬が雪かきのお手伝い！？「働き者ですね」https://news.livedoor.com/article/detail/23485642/犬の手も借りたい🐾 pic.twitte...",
                "source": {
                    "name": "Himasoku.com",
                    "id": null
                },
                "title": "【画像あり】雪かきを手伝う犬がかわいいと話題ｗｗｗｗｗ",
                "url": "http://himasoku.com/archives/52209178.html",
                "content": "10: () [CN] 2023/01/05() 10:28:46.08 ID:D9u55e470\r\n50: () [NL] 2023/01/05() 11:17:46.32 ID:UesM/PZs0\r\n12: () [] 2023/01/05() 10:28:47.17 ID:AXX7r5R70\r\n19: () [US] 2023/01/05() 10:33:44.64 ID:BIgEGIIZ\u2026 [+1400 chars]"
            },
            {
                "publishedAt": "2022-12-31T06:21:25Z",
                "author": null,
                "urlToImage": "https://blogimg.goo.ne.jp/user_image/60/ff/5ccf39c36395a22168aa2bd911cabbd0.jpg",
                "description": "年末恒例の私的ベスト企画です。2022年に観た展覧会のベスト10をあげてみました。\n\n2022年　私が観た展覧会　ベスト10\n\n1.『国際芸術祭「あいち2022」』　一宮駅エリア / 尾西エリア /愛知芸術文化センター /有松地区 / 常滑やきもの散歩道 / INAXライブミュージアム（7/30～10/10）\n\n\n\n『あいちトリエンナーレ』の後継として開催された『国際芸術祭　あいち2022』の展示が大変に見応えがありました。愛知芸術センターではコンセプチュアル・アートから人間の尊厳や社会の分断といったテーマを扱っ\u2026",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "2022年　私が観た展覧会　ベスト10",
                "url": "https://blog.goo.ne.jp/harold1234/e/6d3f4655a85ccf93db0c13b022addcd8?fm=rss",
                "content": "202210202210\r\n1.2022 / / / / / INAX7/3010/10\r\n2022\r\n2.2021/9/182022/3/30\r\n198040\r\n3.5002/95/30\r\n4665\r\n4.24/237/3\r\n2400\r\n5. 7/169/19\r\n4\r\n6.×× 4/297/10\r\n7.6/710/2\r\n16110\r\n8.9/2111/27\r\n9.708/210/16\r\n150\u2026 [+683 chars]"
            }
        ],
        "11222": [
            {
                "publishedAt": "2023-01-05T05:01:50Z",
                "author": "admirecat",
                "urlToImage": "https://livedoor.blogimg.jp/admirecat/imgs/0/a/0a2aac9f.png",
                "description": "1: それでも動く名無し  2023/01/05(木) 12:01:48.78 ID:6OZwxrhX0 https://www3.nhk.or.jp/news/html/20230104/k10013940721000.html    先月のクリスマスに埼玉県飯能市で親子3人が殺害された事件で、近くに住む容疑者の自宅で押収された血の付いた衣類から、被害者3人のDN",
                "source": {
                    "name": "Doorblog.jp",
                    "id": null
                },
                "title": "【驚愕】飯能市ハンマー男、パソコンやスマホを持たずに引きこもり生活をしていた",
                "url": "http://shikaku2ch.doorblog.jp/archives/57241064.html",
                "content": "1: 2023/01/05() 12:01:48.78 ID:6OZwxrhX0\r\n2: 2023/01/05() 12:02:03.22 ID:ybAYwIAor\r\n: https://nova.5ch.net/test/read.cgi/livegalileo/1672887708/\r\n6: 2023/01/05() 12:02:51.46 ID:3PW8SiaJM\r\n8: 2023/01/\u2026 [+1676 chars]"
            },
            {
                "publishedAt": "2023-01-07T03:56:38Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230107/K10013943731_2301071255_0107125639_01_02.jpg",
                "description": "6日夜、埼玉県狭山市で暴力団員とみられる50代の男性が拳銃で撃たれて死亡した事件で、目撃情報から、容疑者は黒いフルフェースのヘルメットをかぶって男性を襲ったあとバイクで逃走したとみられることが捜査関係者への取材で分かりました。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "暴力団員とみられる男性撃たれ死亡 容疑者バイクで逃走か 埼玉",
                "url": "https://www3.nhk.or.jp/news/html/20230107/k10013943731000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-02T02:00:00Z",
                "author": "高橋 ユキ",
                "urlToImage": "https://bunshun.jp/mwimgs/3/b/1200wm/img_3b475c16b1719c529e6f2c32c916e4b659185.jpg",
                "description": "埼玉県川越市に住んでいた浄化槽点検管理業、Tさん（59＝当時）が、突然姿を消したのは2011年6月。家族が8月に捜索願を出したが、行方は分からないまま。　ところがその翌年、Tさんは、自宅から遠い長野県\u2026",
                "source": {
                    "name": "Bunshun.jp",
                    "id": null
                },
                "title": "「遺体をキムチ鍋にして食べた」元義父を殺害、遺体を解体し\u2026犯人の元妻が語った\u201c地獄のような結婚生活\u201d",
                "url": "https://bunshun.jp/articles/-/59335",
                "content": "T59201168\r\nT\r\nT46\r\nT22\r\n©iStock.com\r\n23\r\n20030034\r\nT\r\n10002"
            },
            {
                "publishedAt": "2022-12-30T23:30:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221228002724_comm.jpg",
                "description": "まさか年齢が理由で家探しを断られるなんて、思ってもみなかった。　いまは都内に住む男性（72）が引っ越しをしようと思い立ったのは、10年前のことだ。　当時一人暮らしをしていたアパートは、埼玉県新座市に\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "「高齢者に貸す家はない」　不動産屋で門前払いされた男性のもやもや",
                "url": "https://www.asahi.com/articles/ASQDX5TNSQDJUTIL034.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-01T03:10:31Z",
                "author": "中島優",
                "urlToImage": "https://news.mynavi.jp/article/20230101-saitama_kayosai/ogp_images/ogp.jpg",
                "description": "きょう1日に放送されるテレビ埼玉(テレ玉)の正月恒例特番『第31回埼玉政財界人チャリティ歌謡祭』(19:00～ \u203b再放送：同8日19:00～)。年々磨きがかかる出場者のユニークなパフォーマンスと、お堅いイメージの政財界人とのギャップが大きな話題を集め、今や県を越えて\u201c埼玉の奇祭\u201dと呼ばれるようになり、Twitterでは世界ト...",
                "source": {
                    "name": "Mynavi.jp",
                    "id": null
                },
                "title": "【第31回埼玉政財界人チャリティ歌謡祭】司会・堀尾正明「熱気は紅白以上」 やみつきになる\u201c奇祭\u201dの魅力 (1)",
                "url": "https://news.mynavi.jp/article/20230101-saitama_kayosai/",
                "content": "1()31(19:00 819:00)Twitter\r\n1126201410NHK\r\n<ul><li>\r\n(C)\r\n<\/li><\/ul>\r\n()3\r\nNHK\r\n111\r\n<ul><li>\r\n<\/li><\/ul>\r\n()"
            }
        ],
        "11343": [
            {
                "publishedAt": "2023-01-06T18:20:18Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230107000395_comm.jpg",
                "description": "埼玉県狭山市広瀬台1丁目のマンション近くで6日夜、50代の男性が銃撃されたとみられる事件で、県警は7日未明、男性がマンションの住民で職業不詳の鈴木頼一（よりかず）さん（55）と判明し、搬送先の病院で\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "埼玉県狭山市のマンション銃撃事件、55歳男性が搬送先の病院で死亡",
                "url": "https://www.asahi.com/articles/ASR1710BYR16UTNB020.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-04T22:00:19Z",
                "author": "honwaka2ch",
                "urlToImage": "https://livedoor.blogimg.jp/honwaka2ch/imgs/0/0/006cc2e3-s.jpg",
                "description": "3 名前：ソマリ(神奈川県) [ﾆﾀﾞ][] 投稿日：2023/01/04(水) 17:34:30.71 ID:AVvvhF/N0ホウボウ22 名前：マーブルキャット(埼玉県) [US][] 投稿日：2023/01/04(水) 17:37:02.44 ID:IVuj5tci0 [1/3]>>3同じくホウボウ新潟で食べてめちゃくちゃ美味かった35 名前：カラカル(愛知...",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "初めて食った魚で「ほう、こりゃうめぇわ」と関心した魚",
                "url": "http://honwaka2ch.livedoor.biz/archives/10207190.html",
                "content": "3 () [][] 2023/01/04() 17:34:30.71 ID:AVvvhF/N022 () [US][] 2023/01/04() 17:37:02.44 ID:IVuj5tci0 [1/3]&gt;&gt;3\r\n35 () [US][sage] 2023/01/04() 17:38:56.70 ID:K+AVGSVn0&gt;&gt;3\r\n96 () [VE][] 2023/01\u2026 [+1482 chars]"
            },
            {
                "publishedAt": "2023-01-04T20:01:00Z",
                "author": null,
                "urlToImage": "https://articleimage.nicoblomaga.jp/image/279/2023/6/3/63894f6c0886f7c1d92aebb4e16662d046971fd31672834278.jpg",
                "description": "埼玉県飯能市の住宅で3人が殺害された事件で、逮捕された男が「身に覚えのない話です」などと警察に話していることがわかった。先月25日、飯能市の住宅でウィリアム・ビショップさん（69）と妻の森田泉さん（68）娘の森田ソフィアナ恵（めぐみ）さん（32）が死亡しているのが見つかった。警察は近くに住む斎藤淳（40）容疑者をビショップさんに対する殺人容疑で捜査している。斎藤容疑者は、逮捕後に「言いたくありませ",
                "source": {
                    "name": "Alfalfalfa.com",
                    "id": null
                },
                "title": "【飯能事件】一家を皆殺しにした容疑の男性「身に覚えのない話です」",
                "url": "http://alfalfalfa.com/articles/334036.html",
                "content": "https://t.co/5hgvUTjY60 # #\r\n \u2014 (@alfalfaGeinow) 202315"
            },
            {
                "publishedAt": "2022-12-31T20:07:00Z",
                "author": "スポニチアネックス",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/f/4/f492f_929_0768ba4a_68f70b94.jpg",
                "description": "埼玉県・川口オートレース場の「スーパースターフェスタ2022」は31日、最終日12RでSG「第37回スーパースター王座決定戦」（優勝賞金3100万円）が行われ、3号車の鈴木圭一郎（28＝浜松）が3枠トップスタートから10周回を逃げ切って優勝した。16年以来2度目のスーパースター制覇。通算12回目のSG優勝となった。2着は有吉辰也、3着は松尾啓史。大会4連覇を狙った青山周平は4着に敗れた。怪物青山の偉業を阻んだのはNo・1、圭一郎の底力だった。3枠から勢い良く飛び出して主導権。周回 全文スポニチアネックス 01月0\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "【川口・スーパースター王座決定戦】鈴木圭一郎6年ぶり王座奪回　トップS圧逃　青山の4連覇阻止",
                "url": "https://news.livedoor.com/article/detail/23470808/",
                "content": "20223112RSG37310032831016212SG2344\r\nNo13330850\r\n20316G1SG3\r\n22226144\r\n1994611302813732SG12VG113V633315950A"
            }
        ],
        "11464": [
            {
                "publishedAt": "2023-01-01T06:40:54Z",
                "author": "スポニチアネックス",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/6/a/6aca9_929_bcd72fcf_5af7ffd7.jpg",
                "description": "◇第67回全日本実業団対抗駅伝競走大会「ニューイヤー駅伝」（スポニチ後援）（2023年1月1日群馬県庁発着＝7区間、100キロ）東京都、埼玉県、千葉県で生鮮食品を中心としたスーパーマーケット・スーパーべルクス45店舗を展開する「サンベルクス」が過去の最高の15位に入った。3年連続5回目の出場で、これまで最高だった23位を大きく上回る15位でフィニッシュすると、応援していた買い物客がセールを期待してアクセスが殺到したのか、同社のホームページ（HP）がダウン。SNS上 全文スポニチアネックス 01月01日15時40分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "【ニューイヤー駅伝】セール期待でHP一時ダウン！？スーパー展開のサンベルクス過去最高15位",
                "url": "https://news.livedoor.com/article/detail/23472586/",
                "content": "672023117100\r\n4515\r\n352315HPSNS15\r\n12317228243261943152816??29216731115"
            }
        ],
        "11104": [
            {
                "publishedAt": "2023-01-05T09:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230105001669_comm.jpg",
                "description": "受験生や就職活動中の人を応援するため、埼玉県秩父市の合角（かっかく）ダム近くにある環境学習施設「吉田元気村」が13日から、縁起担ぎの「ごうかくダムカレー」を販売する。「合角」は「ごうかく」と読めるこ\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "ダム由来のごうかく祈願カレーが今年も販売　縁起物を詰め込みました",
                "url": "https://www.asahi.com/articles/ASR154CTTR15UTNB004.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-03T06:36:26Z",
                "author": null,
                "urlToImage": "https://cdn-ak.f.st-hatena.com/images/fotolife/e/earth720105/20230103/20230103095759.jpg",
                "description": "高校あるあるネタですが、クラスに1名はいる、ありえなく遠い場所から通って来る遠距離通学の生徒。。 僕が通っていた高校では、栃木県宇都宮市のJR東北本線「岡本駅」から東京都武蔵野市のJR中央線「吉祥寺駅」まで通学する岡本君(仮名)がぶっちぎりのNo.1でした。隣県の埼玉を縦断して西東京にある武蔵野市までの小旅行、大学や会社だったらまだしも、高校生なんだから少しは学校選びを考えなさいよ(｀Д´)ﾉ 乗り換えサイトで調べてみたら所要時間は2時間30分程度で思ったより短い時間でビックリ、でも岡本君が高校に通っていた頃は3\u2026",
                "source": {
                    "name": "Hatenadiary.jp",
                    "id": null
                },
                "title": "JR烏山線「EV-E301」は廃止の噂を吹き飛ばすハイテク蓄電池駆動電車 - だいだらボッチの激安おでかけバンザイ",
                "url": "https://earth720105.hatenadiary.jp/entry/2023/01/03/124806",
                "content": "1\r\nJRJR()No.1(´)\r\n23035\r\n()\r\nEV-E301(ACCUM)\r\nEV-E301\r\nCO2\r\nJRJR\r\n711EV-E301\r\n(&gt;_&lt;)\r\n13\r\n()7EV-E301ACCUM2662\r\n()\r\n2\r\n()(´) \r\nナスカラ市場\r\nICSuica\r\n7\r\n(?)5\r\n20m65m4m2m2\r\nJR\r\nEV-E301\r\n1\r\n20227JR66\r\n鉄道 \u2026 [+52 chars]"
            },
            {
                "publishedAt": "2023-01-05T04:00:35Z",
                "author": "ガジェット通信",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/9/3/93217_242_97c78337eda3d16f0ffc013baca8c563.jpg",
                "description": "地方創生移住支援事業の一つに移住支援金があります。これは東京23区に在住・通勤する人が、東京圏外（東京都、埼玉県、千葉県、神奈川県以外）に移住して起業や就業等を行う人に対し、各地方自治体が1世帯あたり最大100万円＋子供1人あたり30万円の支援金を給付する事業のことです。https://twitter.com/jijicom/status/1608073714255503366昨年の12月28日、日本政府は子供1人あたりの支援金を30万円から100万円に引き上げる方針を決定しました。これが海外で話題を呼んでいます\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "日本の移住支援金が海外で話題 「東京の人口密度は異常だから」「アメリカドルだと大した金額じゃねえな」",
                "url": "https://news.livedoor.com/article/detail/23486989/",
                "content": "231100130\r\nhttps://twitter.com/jijicom/status/1608073714255503366\r\n1228130100\r\nhttps://twitter.com/FoxNews/status/1610697602714025996\r\nhttps://twitter.com/CNBC/status/1610289889450377216\r\nhttps://twi\u2026 [+275 chars]"
            },
            {
                "publishedAt": "2023-01-06T07:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/29869/364/ogp/d29869-364-35a7c4df7f4286a51ca7-0.jpg",
                "description": "[ケイアイスター不動産株式会社]\n　ケイアイスター不動産株式会社（本社／埼玉県本庄市、代表取締役／塙　圭二、以下「当社」と言う。）のケイアイチャレンジドアスリートチームに所属する岩渕　亜依（いわぶち　あい）選手が、この度「東京ゆか...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "ケイアイチャレンジドアスリートチーム 岩渕　亜依選手令和4年度「東京ゆかりパラアスリート」に認定",
                "url": "https://prtimes.jp/main/html/rd/p/000000364.000029869.html",
                "content": "202212202\r\n20225244\r\n4712955\r\n2020242025\r\n19938242019MVP2019W52023W\r\n2013 222013()62015 3()62018 4() 2019 1()2019 4()52022 24\r\n2019481,00020203\r\nhttps://www.athlete.ki-group.co.jp/\r\n 4\r\nhttps://www.s\u2026 [+342 chars]"
            },
            {
                "publishedAt": "2023-01-05T05:00:10Z",
                "author": "nwknews",
                "urlToImage": "https://livedoor.blogimg.jp/nwknews/imgs/6/b/6b3973f7.jpg",
                "description": "1: ヤマネコ(埼玉県) [CO]  2023/01/05(木) 10:23:31.72 ID:pKzizopM0● BE:971946189-2BP(3000)ストリートビュー投稿写真にヤバイの発見した ■大雪で「秋田犬の手も借りたい」→酒屋の看板犬が雪かきのお手伝い！？「働き者ですね」    警報級の大雪で被害も出た新潟県長岡",
                "source": {
                    "name": "Livedoor.jp",
                    "id": null
                },
                "title": "雪かきを手伝う犬がかわいいと話題ｗｗｗｗｗ",
                "url": "http://blog.livedoor.jp/nwknews/archives/6003210.html",
                "content": "zarathustra1116@yahoo.co.jp"
            }
        ],
        "11225": [
            {
                "publishedAt": "2023-01-08T00:00:06Z",
                "author": "honwaka2ch",
                "urlToImage": "https://livedoor.blogimg.jp/honwaka2ch/imgs/b/3/b30e6b82-s.jpg",
                "description": "14 名前：ボルネオヤマネコ(埼玉県) [US][sage] 投稿日：2023/01/07(土) 13:09:53.28 ID:WGRUai0k0擬態がいちばん謎だな！枯れ葉の形に完璧に擬態するとか何目線21 名前：ピクシーボブ(やわらか銀行) [NL][sage] 投稿日：2023/01/07(土) 13:14:48.79 ID:vMPJuJHf0>>14よく似...",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "【進化】擬態がいちばん謎だな！ 枯れ葉の形に完璧に擬態するとか何目線",
                "url": "http://honwaka2ch.livedoor.biz/archives/10208124.html",
                "content": "14 () [US][sage] 2023/01/07() 13:09:53.28 ID:WGRUai0k021 () [NL][sage] 2023/01/07() 13:14:48.79 ID:vMPJuJHf0&gt;&gt;14\r\n71 () [KR][sage] 2023/01/07() 13:58:06.14 ID:u2qyPbIk0 [1/2]&gt;&gt;21\r\n77 () [\u2026 [+328 chars]"
            }
        ],
        "11103": [
            {
                "publishedAt": "2023-01-06T12:00:24Z",
                "author": "砂子間正貫",
                "urlToImage": "https://rocketnews24.com/wp-content/uploads/sites/2/2023/01/IMG_4415.jpg?w=1200&h=630&crop=1",
                "description": "2022年12月31日、埼玉県寄居町の特設広場に数百台のデコトラ（デコレーショントラック）が集結し、カウントダウン ＆ 初日の出イベントが開催された。主催したのは全国哥麿呂（うたまろ）会。もちろんデコトラ界のレジェンド「 [\u2026]",
                "source": {
                    "name": "Rocketnews24.com",
                    "id": null
                },
                "title": "【画像多数】全国からトラック野郎が大集結！ 大晦日に数百台のデコトラが埼玉県に集まる / 伝説の「一番星号」に乗ってきたぞォォオオ！",
                "url": "https://rocketnews24.com/2023/01/06/1746505/",
                "content": "20221231\r\n13\r\nYouTube\r\n2022\r\n/ YouTube,used with permission.\r\n(YouTube)"
            },
            {
                "publishedAt": "2023-01-04T10:26:04Z",
                "author": "共同通信",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/b/e/bedd7_1675_ff88964eba1fd1306f02657d23669037.jpg",
                "description": "新型コロナウイルス・オミクロン株の電子顕微鏡写真（国立感染症研究所提供）国内で4日、新たに10万4564人の新型コロナウイルス感染者が確認された。都道府県別では東京1万554人、大阪7255人、神奈川6567人など。死者は東京25人、大阪24人、埼玉23人など計334人が報告された。厚生労働省によると、全国の重症者は前日から13人増えて615人だった。熊本などで過去の感染者数の修正があった。 全文共同通信 01月04日19時26分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "国内10万4564人感染　新型コロナ、334人死亡",
                "url": "https://news.livedoor.com/article/detail/23484009/",
                "content": "4104564155472556567252423334\r\n13615"
            }
        ],
        "11224": [
            {
                "publishedAt": "2023-01-02T08:15:03Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/0/a/0a518b49-s.png",
                "description": "1: イグナヴィバクテリウム(埼玉県) [CO]  2022/08/28(日) 09:45:09.02 ID:b0Tzjjxe0● BE:971946189-2BP(3000)  sssp://img.5ch.net/ico/2-1.gif  ■セルフレジ導入で人手不足解消のはずが、逆効果に？　その事情を担当者に訊いてわかった意外な理由とは    「従業員の人員",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "「人員不足により、セルフレジは封鎖します」とあるスーパーで起こった驚きの事情ｗｗｗｗｗ",
                "url": "http://news4vip.livedoor.biz/archives/52474936.html",
                "content": "1: () [CO] 2022/08/28() 09:45:09.02 ID:b0Tzjjxe0 BE:971946189-2BP(3000)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1661647509/"
            },
            {
                "publishedAt": "2023-01-04T09:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230104001894_comm.jpg",
                "description": "埼玉県飯能市の住宅で昨年12月、親子3人が殺害された事件で、現場となった住宅の室内から血痕が見つかっていたことが捜査関係者への取材でわかった。被害者の遺体はいずれも屋外で発見されており、県警は被害者\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "容疑者は室内でも襲撃か、住宅内に血痕　埼玉県飯能市の3人殺害事件",
                "url": "https://www.asahi.com/articles/ASR14559CR14UTNB007.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            }
        ],
        "11301": [
            {
                "publishedAt": "2023-01-01T01:45:00Z",
                "author": "momoka",
                "urlToImage": "https://isuta.jp/wp-content/uploads/2022/12/media_0f545b54ed2f1976f5ee59e3e84470e7f5fd75c8.gif",
                "description": "明けましておめでとうございます！\n\n一年のスタートに欠かせない初詣では、\u201cかわいくてワクワクするおみくじ\u201dを引きたいですよね。\n\nそこで今回は、全国で引ける「かわいいアニマルみくじ」を7つご紹介します。\n\n北海道／帯廣神社　シマエナガみくじ\r\n\n\n\n\n@s.jjj.k / Instagram\n\n\nまずはじめにご紹介するのは、北海道・帯広に鎮座する「帯廣神社」。こちらの神社は、国土の安全や開拓の神として広く信仰されています。\n\nここでは、「シマエナガみくじ」を引くことができますよ。\u201c雪の妖精\u201dとして人気のあるシマエ\u2026",
                "source": {
                    "name": "Isuta.jp",
                    "id": null
                },
                "title": "【2023年初詣】今年は「アニマルみくじ」でスタートしない？全国で引けるかわいいおみくじ7選をご紹介",
                "url": "https://isuta.jp/616468",
                "content": "@t__jm4 / Instagram\r\n\u201c\u201d\r\n7\r\n@s.jjj.k / Instagram\r\n\u201c\u201d\r\n321HPhttp://www.obihirojinja.jp/\r\n@nananissimo / Instagram\r\n\u201c\u201d\r\n7HPhttp://kanahebi.cdx.jp/IG@kanahebi_shrine\r\n8:3016:00 /  9:3016:00L.O. 15:45/ 1\u2026 [+414 chars]"
            },
            {
                "publishedAt": "2023-01-05T04:31:52Z",
                "author": "funs",
                "urlToImage": "https://livedoor.blogimg.jp/funs/imgs/2/9/2917cf19.jpg",
                "description": "1: それでも動く名無し  2023/01/05(木) 12:01:48.78 ID:6OZwxrhX0  埼玉 3人殺害事件 容疑者宅で押収の衣類から被害者3人のDNA型https://www3.nhk.or.jp/news/html/20230104/k10013940721000.html    先月のクリスマスに埼玉県飯能市で親子3人が殺害された事件で、近くに住",
                "source": {
                    "name": "2chblog.jp",
                    "id": null
                },
                "title": "飯能市ハンマー男、パソコンやスマホを持たずに引きこもり生活をしていた",
                "url": "http://gahalog.2chblog.jp/archives/52539491.html",
                "content": "20230105 13:31  \r\n(1)\r\n1: 2023/01/05() 12:01:48.78 ID:6OZwxrhX0\r\n3: 2023/01/05() 12:02:15.89 ID:6OZwxrhX0\r\n6: 2023/01/05() 12:02:51.46 ID:3PW8SiaJM\r\n11: 2023/01/05() 12:03:31.09 ID:+KewfsuV0\r\n12: 202\u2026 [+1637 chars]"
            },
            {
                "publishedAt": "2023-01-06T13:15:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230106004603_comm.jpg",
                "description": "6日午後7時15分ごろ、埼玉県狭山市広瀬台1丁目のマンションの住民から、「夫が拳銃で撃たれた」と119番通報があった。埼玉西部消防組合によると、50代の男性が路上で血を流して倒れており、救急搬送され\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "住宅街で「発砲音」　50代男性負傷、指定暴力団幹部か　埼玉・狭山",
                "url": "https://www.asahi.com/articles/ASR167D4KR16UTNB01P.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            }
        ],
        "11106": [
            {
                "publishedAt": "2022-12-31T09:00:34Z",
                "author": "asm",
                "urlToImage": "https://iphone-mania.jp/uploads/2022/12/29/2022-12-29_01-35-08.jpg",
                "description": "KDDIは、同社が手がけるスマホ決済サービスau PAY（コード支払い）を利用するとau PAY残高を還元するキャンペーンを2023年1月1日より実施します。15都道府県17自治体と連携して行うもので、実施期間や還元額などは自治体により異なります。\n対象店舗でau PAY(コード支払い)を利用するとau PAY残高を還元\nこのキャンペーンはKDDIが地方自治体と共同で実施している「au PAY×地方自治体連携キャンペーン」の一環で、2023年1月からは、北海道・秋田県・埼玉県・東京都・神奈川県・静岡県・愛知県・三\u2026",
                "source": {
                    "name": "Iphone-mania.jp",
                    "id": null
                },
                "title": "au PAY、17自治体で残高還元キャンペーン開催～2023年1月1日から",
                "url": "http://iphone-mania.jp/news-513082/",
                "content": "KDDIau PAYau PAY2023111517au PAY()au PAY\r\nKDDIau PAY×2023117au PAY20231151411561621153\r\n<table><tr><th><\/th><th><\/th><th><\/th><th><\/th><\/tr><tr><td><\/td><td>202316131<\/td><td>20<\/td><td>1,000/5,000/<\u2026 [+1158 chars]"
            }
        ],
        "11227": [
            {
                "publishedAt": "2023-01-01T14:16:30Z",
                "author": "booq",
                "urlToImage": "https://livedoor.blogimg.jp/booq/imgs/4/8/48e78372-s.jpg",
                "description": "1 ： アジアゴールデンキャット(埼玉県) ：2023/01/01(日) 20:57:23.95 ID:C6U5LwgR0●ソーステレ朝GACKT「間違ったら引退」　2年ぶり参戦の「格付けチェック！」は一人で挑戦　現在個人65連勝中https://news.yahoo.co.jp/articles/182a13de1aea3fb5fda0c348b7694d95c58d138d...",
                "source": {
                    "name": "Matometanews.com",
                    "id": null
                },
                "title": "【速報】GACKTさん快挙！「格付けチェック」で７１連勝を達成",
                "url": "http://matometanews.com/archives/2054064.html",
                "content": "180\r\n(60)\r\n2 () 2023/01/01() 20:57:39.06 ID:SgmNeLH9058 () 2023/01/01() 21:09:04.09 ID:uPgg3BW20&gt;&gt;2\r\n4 () 2023/01/01() 20:57:57.87 ID:IVEh5F6U0\r\n5 () 2023/01/01() 20:57:59.61 ID:BLGcrhXz0Gackt\r\u2026 [+3472 chars]"
            },
            {
                "publishedAt": "2023-01-05T05:03:55Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/107915/5/ogp/d107915-5-4ebd1b8bcf6b3e7e0b92-1.jpg",
                "description": "[株式会社SOUZOUDO]\n[画像1: https://prtimes.jp/i/107915/5/resize/d107915-5-4ebd1b8bcf6b3e7e0b92-1.jpg ]\n\n\n\n\n２年前、成人式の中止をきっかけに始まったプロジェクト\n\n\n\n新型コロナウィルスの感染拡大に伴い、三郷市では、令和...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "【埼玉県三郷市初】新成人を対象に、市内の飲食店等で使える特典を配信するLINE公式アカウント『YOUTH 3310』をリリースしました。",
                "url": "https://prtimes.jp/main/html/rd/p/000000005.000107915.html",
                "content": "NPO 2\r\n3\u201d\u201dGATE33102023http://www.misatopi.com/misatoshinseijin/\r\nYOUTH3310LINELINE\r\n \r\nYOUTH331020024220044120YOUTH3310  LINEhttps://lin.ee/TU7M5OO\r\nGATE33102022112GATE3310  Webhttps://gate-project.j\u2026 [+55 chars]"
            },
            {
                "publishedAt": "2023-01-04T02:46:06Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230104/K10013940721_2301041129_0104114607_01_02.jpg",
                "description": "先月のクリスマスに埼玉県飯能市で親子3人が殺害された事件で、近くに住む容疑者の自宅で押収された血の付いた衣類から、被害者3人のDNA型が検出されたことが、警察への取材で分かりました。容疑者は「自分はやっていない。身に覚えがない」と供述しているということです。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "埼玉 3人殺害事件 容疑者宅で押収の衣類から被害者3人のDNA",
                "url": "https://www3.nhk.or.jp/news/html/20230104/k10013940721000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-02T03:58:56Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230102/K10013939871_2301021228_0102125857_01_03.jpg",
                "description": "景勝地として知られる埼玉県長瀞町の「岩畳」で、子どもたちや高齢者も参加して、空手の初稽古が行われました。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "景勝地の「岩畳」で空手の初稽古 埼玉 長瀞町",
                "url": "https://www3.nhk.or.jp/news/html/20230102/k10013939871000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-06T21:15:37Z",
                "author": "igarashinaotaka",
                "urlToImage": "https://object-storage.tyo1.conoha.io/v1/nc_e533f50b34984adfb3d5b5c849e46efe/agora-boject-storage/2023-01-iStock-871867384.jpg",
                "description": "戦後77年「喜寿」を迎えた戦後日本。しかし終戦の日を迎えてから、相次ぎ年長者の道徳観、倫理規範を疑うしかない恥ずべき事件が相次いだ。愛知県牧之原市の園児通園バス取り残し熱中症死事件であり、埼玉県川口市の准看護学校半数退学事件である。さらに静\u2026",
                "source": {
                    "name": "Agora-web.jp",
                    "id": null
                },
                "title": "弱き者を援ける志を砕く、道徳規範とロールモデルなき精神的亡国の日本",
                "url": "https://agora-web.jp/archives/230104043438.html",
                "content": "773\r\n99\r\nbee32/iStock\r\n202295370\r\n2\r\n20163718\r\n10%\r\n10/27\r\n803\r\n97\r\n606070\r\n301010"
            }
        ],
        "11348": [
            {
                "publishedAt": "2023-01-06T18:00:41Z",
                "author": "kinisoku",
                "urlToImage": "https://livedoor.blogimg.jp/kinisoku/imgs/7/d/7d2673dd.jpg",
                "description": "1：ギコ(東京都) [CN]：\n2023/01/02(月) 22:34:23.41ID:qQHMgdxi0\n\nデリヘルであれをする女は、速攻で悪口書き込んでる\n\n\n\n\n\n\n\n\n\n2：オリエンタル(埼玉県) [JP]：\n2023/01/02(月) 22:35:15.32ID:FEXjxugm0\n\n舐めたくないからな\n\n\n\n\n\n\n\n\n\n3：アジアゴールデンキャット(光) [...",
                "source": {
                    "name": "Livedoor.jp",
                    "id": null
                },
                "title": "手コキをする時にツバを垂らしてシコシコする女はアリかナシか",
                "url": "http://blog.livedoor.jp/kinisoku/archives/5400660.html",
                "content": "Copyright (C) 2011 --. All rights reserved."
            },
            {
                "publishedAt": "2023-01-05T05:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "損害車\u203b1買取台数で業界シェアNo.1の株式会社タウ（本社：埼玉県さいたま市、代表：宮本明岳）は、損害車を修復して販売する中古車小売店舗、カーテンダー愛知を1月5日（木）にオープンいたしました。\u203b1 事故や災害等により損壊した車両のこと■中古車販売店舗「カーテンダー愛知」について当社は2019年9月より「CARTENDE...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社タウ損害車買取シェアＮｏ.１のタウ 1/5（木）愛知県弥富市に中古車販売店を新規オープン～中部地方で２店舗目の進出、独自保証で安心を提供～",
                "url": "https://japan.cnet.com/release/30817310/",
                "content": "1No.1151 \r\n20199CARTENDER6CARTENDER\r\n2118-46660530/URL \r\nD\r\n31202 3 \r\n300120Globaloop Company\r\n11-2 LA10F\r\n1997631920229447(20229)URL \r\nE-mailpr@tau.co.jpTEL048-601-0820FAX048-601-0850"
            },
            {
                "publishedAt": "2023-01-05T09:53:41Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "スマホサイトを中心にサイトデザイン・ロゴデザインを一新\u201cわたしの知りたい\u201d情報を見つけるナビゲート役にヒューマン・データ・ラボラトリ（埼玉県さいたま市・代表取締役：長 誠）は、生活者の健康と暮らしを応援するポータルサイト「マイライフニュース」を全面リニューアルし、2023年1月5日（木）にオープンしました...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "ヒューマン・データ・ラボラトリ株式会社生活者の健康と暮らしを応援するポータルサイト「マイライフニュース」を全面リニューアル",
                "url": "https://japan.cnet.com/release/30817404/",
                "content": "202315\r\n\u201c\u201d\u201c\u201d\r\n\u201c\u201d\r\n[1: ]\r\nPC[2: ]\r\nPC\r\n139DrinkFoodCosmeBeautyHealthMedicalHomeLivingFashionStyleBabyCareHobbyCultureLeisureTravelStudyWork\u201c\u201d\r\n4\r\n2 \r\nSNS\r\nSNSFacebookTwitterSNSInstagramPinterestInstag\u2026 [+64 chars]"
            }
        ],
        "11105": [
            {
                "publishedAt": "2023-01-01T08:26:34Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230101/K10013939631_2301011615_0101172636_01_02.jpg",
                "description": "厚生労働省によりますと、1月1日に発表した国内の新たな感染者は、空港の検疫などを含め8万6924人となっています。また国内で亡くなった人は、▽東京都で24人▽大阪府で20人▽北海道で17人▽福岡県で14人▽神奈川県で11人▽茨城県で10人▽兵庫県で9人▽長野県で9人▽山口県で8人▽岩手県で8人▽熊本県で8人▽三重県で7人▽京都府で7人▽千葉県で7人▽宮崎県で7人▽広島県で6人▽愛知県で6人▽佐賀県で5人▽埼玉県で5人▽大分県で5人▽岐阜県で5人▽岡山県で5人▽青森県で5人▽宮城県で4人▽秋田県で4人▽群馬県で4人\u2026",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "【新型コロナ厚労省まとめ】247人死亡 8万6924人感染（1日）",
                "url": "https://www3.nhk.or.jp/news/html/20230101/k10013939631000.html",
                "content": "11\r\n292994598692439985539186255159862141989865551418475314547161206737911378690356512894493711128873186123416120776999013310665795352760211213795441337525425432142466759170045512114464531271780408431\u2026 [+293 chars]"
            },
            {
                "publishedAt": "2023-01-01T02:30:00Z",
                "author": "gurum22",
                "urlToImage": "http://www.gurum.biz/wp-content/uploads/2023/01/f56m_1184.jpg",
                "description": "1 名前：アジアゴールデンキャット(埼玉県) [CO] 投稿日：2023/01/01 9:11:44 ID:3（料理メモ）紅白だんごのお雑煮\nhttps://www.asahi.com/articles/DA3S15516959.html",
                "source": {
                    "name": "Gurum.biz",
                    "id": null
                },
                "title": "お雑煮を作るんだがこれは入れとけってやつある？",
                "url": "http://www.gurum.biz/archives/100237445.html",
                "content": "Copyright All Rights Reserved."
            }
        ],
        "11347": [
            {
                "publishedAt": "2023-01-07T08:30:00Z",
                "author": "TBS NEWS DIG",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/6/2/6276c_1796_b16d25ac_94a9eaa5.jpg",
                "description": "3月開幕の「2023ワールド・ベースボール・クラシック（以下WBC）」のメンバー入りが決まった西武の源田壮亮（29）が7日、ピアニストの清塚信也（40）と共に埼玉県入間市で行われたトークショーに参加した。【写真を見る】西武・源田壮亮、WBCに向け「後悔のないよう100%の準備を」侍ジャパン選出から一夜明けファンに決意チケットは販売開始から即完売し、会場には約300人が集結。ゲストMCの清塚が源田を呼び込むと、会場後方からのサプライズ登場でファンを驚かせた。登壇直後、前日 全文TBS NEWS DIG 01月07日\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "西武・源田壮亮、WBCに向け「後悔のないよう100%の準備を」侍ジャパン選出から一夜明けファンに決意",
                "url": "https://news.livedoor.com/article/detail/23499194/",
                "content": "32023WBC29740\r\nWBC100%\r\n300MCWBC\r\nWBC3030\r\n120WBC12017WBC100%\r\n1993216179cm7520163201736201853WBC"
            },
            {
                "publishedAt": "2023-01-06T21:00:00Z",
                "author": "現代ビジネス",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/1/c/1c961_1413_b844e7f7db99c1ebe4c9860b8d9ec5b4.jpg",
                "description": "税務署は「いつ、誰が亡くなったのか」を自動的に把握する仕組みを持っているのです。その仕組みとは、通称『ゴッパチ』と呼ばれている相続税法第58条のこと。相続税の申告をしなくても黙っていればバレない、という甘い考えは通用しないことになります。相続について知っておきたい知識を漫画で紹介します。埼玉県に住む佐藤さん（仮名）ご一家は半年前に突然お父様を亡くされ、相続人は奥様とお子様2人の合計3人。前編でご紹介した通り、葬儀と四十九日が終わり、遺品の片付けもひと 全文現代ビジネス 01月07日06時00分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "知らないと大損\u2026！ 親の財産を知っておくことが「これだけ大事」と言える理由 相続税申告遅延の\u201c3大ペナルティ\u201d",
                "url": "https://news.livedoor.com/article/detail/23496732/",
                "content": "58\r\n23\r\n5810\r\n4\r\n3\r\n1510055\r\n10151520\r\n4050\r\n2\r\n16,0000\r\n3\r\n8\r\n(c)\r\n1\r\n2\r\n93,000600×\r\n213,000600×13,60023,000600×24,200234,800\r\n34,800"
            }
        ]
    },
    "12": {
        "12231": [
            {
                "publishedAt": "2023-01-01T23:34:45Z",
                "author": "oggy0324",
                "urlToImage": "https://livedoor.blogimg.jp/oggy0324/imgs/d/e/de68e5c8.jpg",
                "description": "初日の出はお布団の中から見たサーヤです。こんばんみ。\n大晦日のテレビ\u2026やはり見てしまいます。おもしろ荘。23年、彼らが活躍しますように。\n個人的には、マードックが流行りそうな気がします。\n\nさてさて、今日からは年末年始に行ったサーヤの地元千葉ネタになります！\n\n...",
                "source": {
                    "name": "Doorblog.jp",
                    "id": null
                },
                "title": "【エデン レストラン&スパ】　at　千葉県勝浦市　～勝手に千葉観光大使日記～ 勝浦の海を一望できるレストラン",
                "url": "https://sayabangkok.doorblog.jp/archives/52361802.html",
                "content": "3655\r\n12,8002\r\n5,000\r\n &amp;JR10299-5242 +81-470-64-6370\r\n1114301430171722L.O. 21URLhttp://eden-katsuura.com/SNS\r\n40"
            },
            {
                "publishedAt": "2023-01-05T20:01:00Z",
                "author": null,
                "urlToImage": "https://car.watch.impress.co.jp/img/car/list/1468/331/013.jpg",
                "description": "愛車サブスクリプションサービスを提供するKINTOは、1月13日～15日に幕張メッセ（千葉県千葉市美浜区）で開催されるカスタムカーショー「東京オートサロン2023」にて、新型プリウスの「KINTO Unlimited」の対象グレードの車両を初公開する。",
                "source": {
                    "name": "Impress.co.jp",
                    "id": null
                },
                "title": "KINTO、新型プリウスの「KINTO Unlimited」対象グレードを東京オートサロンで初公開",
                "url": "https://car.watch.impress.co.jp/docs/news/1468331.html",
                "content": "KINTO113152023KINTO Unlimited \r\n KINTO Unlimited2022127 \r\n 2 \r\n 2023 \r\n OTAOver the Air \r\n 20232KINTO UnlimitedT-Connect \r\n KINTO UnlimitedKINTO"
            },
            {
                "publishedAt": "2023-01-06T04:16:38Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "セルフダーマペン/セルフハイフ/セルフ痩身とセルフ機器に革命！東京ビックサイトFCイベントで展示致します。美容機器メーカー株式会社STARTONE（本社：千葉県木更津市長須賀926-2 2F）がセルフ機器3機種を東京ビックサイトで行われるFRAX TOKYOで3機種展示致します。FCせずにマシンのみレンタル/買取プランもOK！セルフ...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社アデプト【セルフ美容機器】東京ビックサイトにてセルフ美容機器展示！1月12日～14日開催！",
                "url": "https://japan.cnet.com/release/30817577/",
                "content": "//FC\r\nSTARTONE926-2 2F3FRAX TOKYO3FC/OK\r\nPro \r\n[1: ]\r\n2\r\nPro\r\nUPFRAX TOKYO\r\nSELF IMPROVE\r\n[2: ]\r\n\u201d\u201d\r\nFRAX TOKYO/\r\nSELFMAKE\r\n[3: ]\r\nSELF MAKE\r\nSELF MAKE\r\n1\r\nFRAX TOKYOSTART ONE\r\nFRAX TOKYO FCOK/\r\n[4: \u2026 [+85 chars]"
            }
        ],
        "12230": [
            {
                "publishedAt": "2023-01-05T01:33:59Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230104003212_comm.jpg",
                "description": "【千葉】青いシャツが似た色の広い空に包まれ、物干し竿（ざお）にはためく。　県内唯一の村にあるカフェを訪ねると、敷地内の一角の小屋で藍染め工房「NORABI（ノラビ）」を営む品田彩来（しなだあやき）さ\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "プロサッカー選手から藍染め師へ　社会への疑問たどり見つけた「青」",
                "url": "https://www.asahi.com/articles/ASR147RJQQCVUDCB00K.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-03T21:39:59Z",
                "author": "goldennews",
                "urlToImage": "https://livedoor.blogimg.jp/goldennews/imgs/5/e/5ea06ce9.png",
                "description": "1 ：それでも動く名無し ：2023/01/03(火) 22:55:08.80 ID:kVTWiMjF0\n\n\n 【悲報】与田祐希「鯨にハマってて、鯨の寿司食べてる」 \n \n 20 君の名は(千葉県) (ﾜｯﾁｮｲW ad10-LBJI) sage 2022/11/06(日) 17:32:32.35 ID:tFbE0y020 \n 彼氏は筋トレのインストラクターか \n\n\n\n6 ...",
                "source": {
                    "name": "Livedoor.jp",
                    "id": null
                },
                "title": "【悲報】 与田ちゃんの疑惑、11月の時点でオタクに見抜かれていた",
                "url": "http://blog.livedoor.jp/goldennews/archives/52209032.html",
                "content": "20 () (W ad10-LBJI) sage 2022/11/06() 17:32:32.35 ID:tFbE0y020"
            },
            {
                "publishedAt": "2022-12-29T04:56:22Z",
                "author": "サッカーキング",
                "urlToImage": "https://www.soccer-king.jp/wp-content/uploads/2022/12/IMG_1996.jpg",
                "description": "第101回全国高校サッカー選手権・1回戦が行われ、日体大柏（千葉）と芦屋学園（兵庫）が対戦した。　全国随一の\u201c激戦区\u201d千葉県予選を勝ち抜き、選手権初出場となる日体大柏と、同じく選手権初出場となる芦屋学園が2回戦進出をかけて激突した。　試合序盤から一進一退の攻防が続くものの、徐々に芦屋学園がペースを掴みだす。一方、日体大柏もビルドアップを駆使してリズムを取り戻そうと試みると12分、MF相原大翔...",
                "source": {
                    "name": "Soccer-king.jp",
                    "id": null
                },
                "title": "日体大柏、華麗な\u201cパスサッカー\u201dで全国初勝利！　3得点で芦屋学園を下す",
                "url": "https://www.soccer-king.jp/news/japan/highschool/20221229/1724069.html",
                "content": "J-GREENYANMAR CUP U-12 -#Football is Our Engine- 2022"
            }
        ],
        "12219": [
            {
                "publishedAt": "2023-01-02T21:33:46Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230103/K10013940151_2301030631_0103063303_01_02.jpg",
                "description": "千葉県は、旭市の養鶏場で死んでいるのが見つかったニワトリから高病原性の鳥インフルエンザウイルスが検出されたと発表しました。今シーズンは全国各地で発生が相次いでいて、養鶏場などでの発生確認件数は、53か所目となり、過去最も多くなっています。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "千葉 旭の養鶏場で鳥インフルエンザ 全国53か所目 過去最多に",
                "url": "https://www3.nhk.or.jp/news/html/20230103/k10013940151000.html",
                "content": "53\r\n230\r\n1\r\n310\r\n5320202021\r\n91028\r\n3235320202021\r\n124\r\n12151392020121161\r\n377420202021987"
            }
        ],
        "12218": [
            {
                "publishedAt": "2022-12-29T12:59:45Z",
                "author": "サッカーキング",
                "urlToImage": "https://www.soccer-king.jp/wp-content/uploads/2022/12/1228_1_021.jpg",
                "description": "第101回全国高校サッカー選手権大会の一回戦が各会場で行われ、柏の葉公園総合競技場では千葉県代表の日体大柏と兵庫県代表の芦屋学園が対戦。初出場校同士の対戦は日体大柏が3－1で勝利して、二回戦へと駒を進めた。　試合後、主将のFW吉田眞翔（3年）は、「試合前のウォーミングアップがピッチ内でできないので、立ち上がりの部分ではボールを慣れるのもあって、前にボール蹴って、そこから自分たちのリズムを作って...",
                "source": {
                    "name": "Soccer-king.jp",
                    "id": null
                },
                "title": "急逝したOB工藤さんの教えと千葉県代表の自負を胸に\u2026日体大柏FW吉田眞翔「全国制覇を」",
                "url": "https://www.soccer-king.jp/news/japan/highschool/20221229/1724440.html",
                "content": "J-GREENYANMAR CUP U-12 -#Football is Our Engine- 2022"
            }
        ],
        "12233": [
            {
                "publishedAt": "2022-12-29T04:26:35Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221229001656_comm.jpg",
                "description": "年末年始を故郷などで過ごす帰省ラッシュが29日、始まった。新型コロナウイルスに伴う行動制限が3年ぶりにない中、JR東京駅では朝から多くの家族連れらが新幹線のホームに列を作った。　千葉県習志野市のパー\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "行動制限なしの年末、帰省ラッシュ始まる　東京駅には家族連れの列",
                "url": "https://www.asahi.com/articles/ASQDY46MTQDYUTIL001.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-01T10:00:00Z",
                "author": "BCN＋R",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/7/0/7004e_1562_0a270bfb_c0ee03fd.jpg",
                "description": "住宅ローン専門金融機関のアルヒは、自社データをもとに住宅専門家が厳選した1都3県（東京・神奈川・埼玉・千葉）の「本当に住みやすい街」のランキング「ARUHI presents 本当に住みやすい街大賞2023」を2022年12",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "「本当に住みやすい街大賞2023」1位はJR中央本線の西八王子が獲得",
                "url": "https://news.livedoor.com/article/detail/23473212/",
                "content": "13ARUHI presents 202320221215ARUHI\r\n222023101JR3.854.131\r\n24.033JR3.8643.7351JR4.243.69\r\n6101IC 1225\r\n8JR123318TJ\r\n23 24232024BCN"
            },
            {
                "publishedAt": "2023-01-01T08:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221229003327_comm.jpg",
                "description": "千葉県と県内市町村の相談窓口などで2021年度に受け付けた移住相談は5197件に上ります。新型コロナウイルスの感染が広がる前の19年度の2681件に比べると、倍増しました。テレワークが浸透して働き方\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "移住相談がコロナ前から倍増　千葉にゆかりのある3人が語る魅力",
                "url": "https://www.asahi.com/articles/ASQDY678NQDYUDCB00H.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-07T04:40:02Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/110396/13/ogp/d110396-13-5f31d6ae0dc78e413dc9-2.jpg",
                "description": "[かき小屋実行委員会]\n「東北の牡蠣を運んで美味しく食べていただく」という活動を通じての漁港の活性化、震災を風化させない取り組み、継続的な東北の復興支援を続ける。\n\n\n[画像1: https://prtimes.jp/i/110396/13/resize/d110396-13...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "宮城県石巻の牡蠣をセルフ炭火焼き(海鮮BBQ)で楽しむ「出張カキ小屋 牡蠣（かき）奉行」がイオンタウン成田富里店（千葉県成田市）に期間限定オープン。期間は1月7日～1月29日",
                "url": "https://prtimes.jp/main/html/rd/p/000000013.000110396.html",
                "content": "2288BBQ20121561,2001600\r\n3390250500()11211390OK↓\r\n286-0025 \r\nTEL 070-3968-1950\r\n202317()129()\r\n11:0021:00(l.o 20:30)\r\nInstagram@event_team.lh\r\nURLhttps://kakibugyo.com/"
            },
            {
                "publishedAt": "2023-01-07T01:28:55Z",
                "author": "Merkmal",
                "urlToImage": "https://newsatcl-pctr.c.yimg.jp/t/amd-img/20230107-10029519-merkmal-000-12-view.jpg?exp=10800",
                "description": "東京都内になくても、名称に「東京」が入る会社やマンション・アパート、店舗は多い。大きな意味での東京圏という意味なのだろう。当然、イメージをよくしたいという思いも働いている。首都圏以外でも、知名度の高い中心都市の名称を冠することはよくあり、特に珍しいことではない。しかし、千葉県では県のシンボルとな...",
                "source": {
                    "name": "Yahoo.co.jp",
                    "id": null
                },
                "title": "「東京ディズニーランド」「東京ドイツ村」 なぜ千葉県の大型施設には「東京」がよく使われるのか（Merkmal） - Yahoo!ニュース",
                "url": "https://news.yahoo.co.jp/articles/6fb2bf845f7b934874e7221f829b4c766558e3e4",
                "content": "JRJRJR40\r\nJRJR\r\n2015\r\n46.8%\r\n35.7%\r\n48.6%\r\n33.2%\r\n39.4%\r\n41.1%"
            }
        ],
        "12211": [
            {
                "publishedAt": "2023-01-04T01:30:00Z",
                "author": "三井物産プラントシステム株式会社",
                "urlToImage": "https://prtimes.jp/common/pc_v4/og.png",
                "description": "[三井物産プラントシステム株式会社]\n三井物産プラントシステム株式会社(本社：東京都港区、代表取締役社長：谷垣匡輝、以下「MPS」)は、TDK株式会社(本社：東京都中央区、代表取締役社長執行役員：斎藤昇、以下「TDK」)とTDK成田工場(千葉県成田市)...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "TDK株式会社成田工場向け電力売買契約(PPA)締結",
                "url": "https://prtimes.jp/main/html/rd/p/000000010.000073612.html",
                "content": "(MPS)TDK(TDK)TDK()(PPA*1)MPSTDKTDKPPA()MPS307MW()PPA(*2)10MWPPAMPSPPAPPA(*3)\r\n *1 PPA(Power Purchase Agreement)PPA*2 PPA()*3 PPA\r\n&lt;&gt;\r\nTEL :    03-6218-3165Email:   mps-TKZPA-onsite@dg.mitsui.com"
            }
        ],
        "12232": [
            {
                "publishedAt": "2023-01-07T23:25:49Z",
                "author": "oggy0324",
                "urlToImage": "https://livedoor.blogimg.jp/oggy0324/imgs/2/3/237058e3.jpg",
                "description": "新年早々、深夜1時まで飲み、体力を使い果たしたサーヤです。こんばんみ。\nえーん。こんな予定ではなかったー！が、楽しいといつの間にか時間が経つのねー。おそろしや。\n当分大人しくします。\n\nさてさて、今日も、勝手に千葉観光大使日記。\n本日は、酪農発祥の地のある千葉...",
                "source": {
                    "name": "Doorblog.jp",
                    "id": null
                },
                "title": "【高秀牧場ミルク工房】　at　千葉県いすみ市　～勝手に千葉大使日記～",
                "url": "https://sayabangkok.doorblog.jp/archives/52361892.html",
                "content": "Google Map😂\r\n🧀\r\n🥛\r\n9298-0106 +81-470-62-66691017:16\r\nURLSNShttps://www.takahide-dairyfarm.com/shopping/"
            },
            {
                "publishedAt": "2023-01-06T12:59:23Z",
                "author": null,
                "urlToImage": "https://blogimg.goo.ne.jp/user_image/00/20/7cabf0d9bcc77f475e29854a026818e8.jpg",
                "description": "これからもぜひ一日一回、上下ともクリックしてくださると大変うれしいです！！！\n\nにほんブログ村\n社会・経済ニュースランキング\n\nAmazon　社会・政治・法律\nAｍazon　Kindle　ベストセラー\n \n \n　ＴＢＳやＮＨＫによりますと、２０２３年１月６日に厚生労働省が発表した新型コロナウイルスによる全国の死者数は４５６人で、去年１２月２９日の４２０人を上回って、一日の発表としては、これまでで最も多くなりました。\n　もっとも、読売新聞によると昨日５日、新型コロナウイルスの者は４９８人で、昨年１２月２７日の４３８\u2026",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "１月６日に厚生労働省が発表した新型コロナウイルスによる全国の死者数は４５６人で過去最多。死者数の波のピークが来るのはまだ１月中旬から下旬。コロナ棄民政策の岸田内閣は総辞職せよ。",
                "url": "https://blog.goo.ne.jp/raymiyatake/e/fcad493828cf7049d98a63aeca3f9551",
                "content": "6\r\n3004437724554240677292720260193815957202903211773189159515928164656311429141798014859132486957813089741221012520245713723873847168779480466148794212554402524255101420764796743960472547571746980949\u2026 [+315 chars]"
            },
            {
                "publishedAt": "2023-01-06T01:48:11Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230105003833_comm.jpg",
                "description": "「どうもみなさん、こんにちば～」　元気よくあいさつするのは、お笑いコンビ「もぐもぐピーナッツ」のうっほ菅原さん（45）とばっしーさん（40）だ。吉本興業の地域活性化プロジェクトで、「千葉県住みます芸\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "「あいつら、売れたな」を夢見て　千葉県住みます芸人はねぎを育てる",
                "url": "https://www.asahi.com/articles/ASR157R8VQD5UDCB018.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-04T01:46:41Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "農業ブランディングサービスを展開する「株式会社農情人（本社：千葉県船橋市、代表取締役：甲斐雄一郎）」は\u201c農業×DeFi\u201d構想の実現を目指す組織「Metagri研究所」を運営しています。未だ前例のない「農業×DeFi」の構想は『農業の常識を超越する「Metagri」～これからの資金調達は「農業×DeFi＝FarmFi」～』で紹介してい...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社農情人【お正月特別企画】「農業×DeFi」のアイディア本『これからの資金調達は「農業×DeFi＝FarmFi」をKindleストアにて三が日限定で無料販売実施！",
                "url": "https://japan.cnet.com/release/30816852/",
                "content": "×DeFiMetagri×DeFiMetagri×DeFiFarmFiMetagri1202311()3Amazon202311()13()\r\n[1: ]\r\nMetagri4×DeFiFarmFiDeFiDecentralized FinanceFarmFi\r\nDeFi\r\nIT\r\nNFTDAOweb3Metagri4\r\nMetagri×DeFi\r\n×DeFiFarmFi\r\nDAODAO Meta\u2026 [+308 chars]"
            }
        ],
        "12235": [
            {
                "publishedAt": "2023-01-02T05:41:48Z",
                "author": "サッカーキング",
                "urlToImage": "https://www.soccer-king.jp/wp-content/uploads/2023/01/7.jpg",
                "description": "第101回全国高校サッカー選手権大会の3回戦が2日に県立柏の葉公園総合競技場で行われ、日体大柏（千葉）と飯塚（福岡）が対戦した。　試合が動いたのは19分、アバウトになった飯塚のバックパスをさらった日体大柏の柏内定FWオウイエ・ウイリアムがボールを持ち込み、飛び出してきたGKの位置を見極めてゴール左にグランダーのシュートを流し込んだ。　一方、県予選からここまで鉄壁を誇ってきた守備が思わぬ形で破...",
                "source": {
                    "name": "Soccer-king.jp",
                    "id": null
                },
                "title": "柏内定FWオウイエの決勝弾で日体大柏が飯塚に競り勝つ",
                "url": "https://www.soccer-king.jp/news/japan/highschool/20230102/1726256.html",
                "content": "J-GREENYANMAR CUP U-12 -#Football is Our Engine- 2022"
            },
            {
                "publishedAt": "2023-01-05T04:00:35Z",
                "author": "ガジェット通信",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/9/3/93217_242_97c78337eda3d16f0ffc013baca8c563.jpg",
                "description": "地方創生移住支援事業の一つに移住支援金があります。これは東京23区に在住・通勤する人が、東京圏外（東京都、埼玉県、千葉県、神奈川県以外）に移住して起業や就業等を行う人に対し、各地方自治体が1世帯あたり最大100万円＋子供1人あたり30万円の支援金を給付する事業のことです。https://twitter.com/jijicom/status/1608073714255503366昨年の12月28日、日本政府は子供1人あたりの支援金を30万円から100万円に引き上げる方針を決定しました。これが海外で話題を呼んでいます\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "日本の移住支援金が海外で話題 「東京の人口密度は異常だから」「アメリカドルだと大した金額じゃねえな」",
                "url": "https://news.livedoor.com/article/detail/23486989/",
                "content": "231100130\r\nhttps://twitter.com/jijicom/status/1608073714255503366\r\n1228130100\r\nhttps://twitter.com/FoxNews/status/1610697602714025996\r\nhttps://twitter.com/CNBC/status/1610289889450377216\r\nhttps://twi\u2026 [+275 chars]"
            },
            {
                "publishedAt": "2023-01-01T01:00:00Z",
                "author": "西日本スポーツ",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/5/2/5281e_1498_9ef360bd_5094bbda.jpg",
                "description": "1993年に開幕したサッカーのJリーグは今年、節目の30周年を迎える。J1福岡のエース山岸祐也（29）はJリーグが始まった年に生まれた。叔父がJリーガーで、千葉県柏市の自宅は柏レイソルの本拠地のすぐ近く。幼い頃から夢見たJのピッチに立ったFWは昨年、福岡がJに初参戦した96年にトログリオが打ち立てたJ1でのクラブ最多得点に並ぶ10得点を挙げた。山岸の「30年」と福岡の未来を聞いた。（聞き手・構成向吉三郎）－今年も福岡でのプレーを決めた。アビスパ福岡は自分のことを 全文西日本スポーツ 01月01日10時00分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "「メッシも、長友さんも\u2026」J1福岡FW山岸祐也、30歳の年に誓う偉業と野望",
                "url": "https://news.livedoor.com/article/detail/23471614/",
                "content": "1993J30J129JJJFWJ96J11030\r\nJ303030\r\n30JW\r\nJ\r\nFCJ0\r\n10\r\n1\r\nJ\r\n30\r\nW\r\nJ1\r\n210J1\r\n101996\r\nWFC352\r\n30FW\r\n1993829342016J220341018380"
            },
            {
                "publishedAt": "2023-01-03T07:26:56Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230103/K10013940391_2301031619_0103162658_01_02.jpg",
                "description": "厚生労働省によりますと3日発表した国内の新たな感染者は空港の検疫などを含め8万9643人となっています。また国内で亡くなった人は▽東京都で24人▽大阪府で20人▽福岡県で12人▽広島県で11人▽岐阜県で10人▽栃木県で10人▽宮崎県で9人▽熊本県で8人▽秋田県で8人▽千葉県で7人▽岡山県で7人▽岩手県で7人▽京都府で6人▽三重県で5人▽兵庫県で5人▽北海道で5人▽和歌山県で5人▽群馬県で5人▽静岡県で5人▽高知県で5人▽鹿児島県で5人▽宮城県で4人▽山口県で4人▽愛媛県で4人▽石川県で4人▽茨城県で4人▽大分県で\u2026",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "【新型コロナ厚労省まとめ】223人死亡 8万9643人感染（3日）",
                "url": "https://www3.nhk.or.jp/news/html/20230103/k10013940391000.html",
                "content": "3\r\n2946762789643401572096282562954635520044828185666448501619436416213854663352129669940881285701287412382292235705001284167208829176057091723545706149854553777647228190345845621464568582169411127142\u2026 [+289 chars]"
            },
            {
                "publishedAt": "2023-01-06T07:46:48Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "AI全自動マシンで効率的に短時間（15分以内）でトレーニング完結！予約不要、服装自由、着替えがいらないため、買い物ついでに気軽に通えちゃう『健康・長寿・美しく』をコンセプトにスーパー併設の新業態を展開する、レオケンフィットネス（店舗：千葉県千葉市緑区誉田町、以下当館）は、次世代に合わせたドイツ生まれ...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社LEOKENTO千葉市緑区『外房線誉田駅』にGRAND OPEN！24時間通い放題2500円～業界最安値のフィットネス、スーパーLEO店内にグランドオープンしました！",
                "url": "https://japan.cnet.com/release/30817668/",
                "content": "AI15\r\nAI\r\n[1: ]\r\n24365\r\n[2: ]\r\n862\r\n11730\r\n[3: ]\r\n110\r\n[1: ]\r\n9:0021:0020:3030\r\n[2: ]\r\n266-0005224-6624(9:0021:00\r\n[3: ]\r\n[4: ]\r\n[5: ]\r\n1/12/28\r\n2,9802500(2,7503,000(3,3003,000(3,300\r\n.2.LINE1\r\nPR TI\u2026 [+2 chars]"
            }
        ],
        "12234": [
            {
                "publishedAt": "2023-01-05T04:46:40Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "～ 住民向けの情報提供にFAQ＆チャットボットMatchWeb(R)を活用 ～NTTアドバンステクノロジ株式会社（以下：NTT-AT、本社：東京都新宿区、代表取締役社長：伊東　匡）は、千葉県安房郡鋸南町（以下、鋸南町）の住民向けにFAQ（よくある質問）サイト・チャットボットによる情報提供の実証実験を2023年1月5日から開始しま...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "NTTアドバンステクノロジ株式会社鋸南町におけるFAQサイト・チャットボットの実証実験を開始",
                "url": "https://japan.cnet.com/release/30817300/",
                "content": "FAQMatchWeb(R) \r\nNTTNTT-ATFAQ202315\r\nNTT-ATQAFAQUI\r\n13\r\nFAQ\r\nNTT-ATFAQFAQMatchWebFAQQA\r\n[: ]\r\n1MatchWeb FAQFAQAI FAQMatchWebFAQAI FAQFAQ\r\n22023152023331\r\nFAQMatchWeb\r\nMatchWebMatchContactSolutionFAQW\u2026 [+20 chars]"
            }
        ],
        "12237": [
            {
                "publishedAt": "2023-01-08T03:03:29Z",
                "author": "miya7yets",
                "urlToImage": "https://livedoor.blogimg.jp/samuraigoal/imgs/6/9/6942e037-s.png",
                "description": "1:    2023/01/07(土) 19:06:17.14   サッカー元日本代表の本田圭佑（36）が7日、自身の今後について「指導者の方に比重は明確に向いていく」と明言した。   この日は、自身がGMを務める「EDO ALL UNITED」の2次セレクションに千葉県内で参加。終了後に囲み取材に応じた。",
                "source": {
                    "name": "Doorblog.jp",
                    "id": null
                },
                "title": "本田圭佑 W杯優勝監督への夢を公の場で初めて明言 今後は「指導者の方に比重が明確に向いていく」",
                "url": "http://samuraigoal.doorblog.jp/archives/60087586.html",
                "content": "1: 2023/01/07() 19:06:17.14 \r\n40: 2023/01/07() 19:37:45.56 \r\n88: 2023/01/07() 20:55:40.16 \r\n99: 2023/01/07() 22:33:12.31 \r\n2: 2023/01/07() 19:06:43.39 \r\n4: 2023/01/07() 19:08:26.35 \r\n5: 2023/01/07() \u2026 [+228 chars]"
            },
            {
                "publishedAt": "2023-01-07T23:00:03Z",
                "author": "fbn_2chfootball",
                "urlToImage": "https://livedoor.blogimg.jp/fbn_2chfootball/imgs/5/4/54f39ecb-s.jpg",
                "description": "1: マングース ★ 2023/01/07(土) 19:06:17.14 ID:cAdcjReQ9\n サッカー元日本代表の本田圭佑（36）が7日、自身の今後について「指導者の方に比重は明確に向いていく」と明言した。この日は、自身がGMを務める「EDO ALL UNITED」の2次セレクションに千葉県内で参加。終了後に...",
                "source": {
                    "name": "2chblog.jp",
                    "id": null
                },
                "title": "本田圭佑 W杯優勝監督への夢を公の場で初めて明言 今後は「指導者の方に比重が明確に向いていく」",
                "url": "https://footballnet.2chblog.jp/archives/57246678.html",
                "content": "W []\r\n55: 2023/01/07() 19:47:51.87 ID:Eh6Yu1Mx0\r\n88: 2023/01/07() 20:55:40.16 ID:Ta1gOVZR0\r\n99: 2023/01/07() 22:33:12.31 ID:6v1bfmXV0\r\n2: 2023/01/07() 19:06:43.39 ID:N96wXHYt0\r\n3: 2023/01/07() 19:08:\u2026 [+2039 chars]"
            },
            {
                "publishedAt": "2023-01-07T06:00:35Z",
                "author": "rebanila",
                "urlToImage": "https://livedoor.blogimg.jp/chaaaahan/imgs/f/c/fc222018.jpg",
                "description": "1: それでも動く名無し  2022/12/31(土) 18:36:11.65 ID:pzsFgX+D0  マジで夜になると反社ぽいやつがわんさか出てくる",
                "source": {
                    "name": "2chblog.jp",
                    "id": null
                },
                "title": "僕、千葉県船橋市住み、いくらなんでも治安が悪すぎる\u2026ｗｗｗｗｗｗｗｗｗｗ",
                "url": "http://oryouri.2chblog.jp/archives/10598619.html",
                "content": "1: 2022/12/31() 18:36:11.65 ID:pzsFgX+D0\r\n3: 2022/12/31() 18:36:42.67 ID:uKAs8vN50\r\n5: 2022/12/31() 18:37:04.92 ID:pzsFgX+D0\r\n6: 2022/12/31() 18:37:16.86 ID:wNSNhB7Kr\r\n7: 2022/12/31() 18:37:46.36 ID:\u2026 [+1971 chars]"
            },
            {
                "publishedAt": "2022-12-30T01:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221229004285_comm.jpg",
                "description": "千葉県木更津市の准看護師養成専門学校「木更津看護学院」で、昨年度の1年生40人（留年含む）のうち15人が自主退学した問題で、同校は28日会見し、教員のパワハラを認めた。重城利国校長が辞任、教員2人が\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "退学続出の看護学校、パワハラ認め謝罪　人格否定・威圧的など7項目",
                "url": "https://www.asahi.com/articles/ASQDY7HM8QDYUDCB009.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-06T05:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/25929/14/ogp/d25929-14-a5298e5782a17e2efccc-0.jpg",
                "description": "[SAI Co.,Ltd.]\n\n新規開校校舎について\n\n\n■イオンモール柏校\n2023年1月21日（土）よりグランドオープン。（現在は無料体験の実施期間中です。）\nSwimmyとしては初となる、ショッピングモールでの出店となります。\n今後のフランチ...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "【子ども向けプログラミングスクールSwimmy】イオンモール柏（千葉県）内、TSUTAYA中央店(愛媛県松山市)内にて新規出店",
                "url": "https://prtimes.jp/main/html/rd/p/000000014.000025929.html",
                "content": "2023121Swimmy\r\nSwimmy20221112SwimmyTSUTAYA\r\n \r\nSwimmyIoTAIVUCA3Python\r\n()\r\n21\r\n*()Swimmy()IoT\r\nPython\r\nIoTMESH\r\nBBCmicro:bit\r\nminecraft with Pythonmicro:bit with PythonRaspberry Pi\r\nSwimmyFCURLhttps:\u2026 [+107 chars]"
            }
        ],
        "12236": [
            {
                "publishedAt": "2023-01-06T23:34:46Z",
                "author": "oggy0324",
                "urlToImage": "https://livedoor.blogimg.jp/oggy0324/imgs/8/6/868f0048.jpg",
                "description": "日本に一時帰国してから胃が大きくなってしまったのか？食いしん坊なのであります。サーヤです。こんばんみ。\nうぐっ！服がキツくなりつつあるんですけどー！ヤヴァイー！\n漢方に手を出そうかと思ってます。\n\nさてさて、今日も今日とて「勝手に千葉観光大使」日記。\n本日も...",
                "source": {
                    "name": "Doorblog.jp",
                    "id": null
                },
                "title": "【南房総館山 鏡ヶ浦温泉rokuza】　at　千葉県館山市　PART2 フード編　～勝手に千葉観光大使日記～",
                "url": "https://sayabangkok.doorblog.jp/archives/52362252.html",
                "content": "1320\r\n😁\r\n rokuza10294-0055 0470-20-569310:0021:00URLhttps://www.rokuza.com/SNS\r\n5"
            }
        ],
        "12239": [
            {
                "publishedAt": "2023-01-04T03:00:38Z",
                "author": "tarumotobn",
                "urlToImage": "https://livedoor.blogimg.jp/rock1963roll/imgs/e/5/e59fe3ad.jpg",
                "description": "引用元: https://nova.5ch.net/test/read.cgi/livegalileo/1672754108/1: それでも動く名無し  2023/01/03(火) 22:55:08.80 ID:kVTWiMjF0  【悲報】与田祐希「鯨にハマってて、鯨の寿司食べてる」    20 君の名は(千葉県) (ﾜｯﾁｮｲW ad10-LBJI) sage 2022/11/06(日) 17:32:32.3",
                "source": {
                    "name": "Livedoor.jp",
                    "id": null
                },
                "title": "【悲報】与田祐希さん、彼氏？がいたことは11月の時点でオタクに見抜かれていたｗｗｗｗｗｗ",
                "url": "http://blog.livedoor.jp/rock1963roll/archives/5400783.html",
                "content": ": https://nova.5ch.net/test/read.cgi/livegalileo/1672754108/\r\n1: 2023/01/03() 22:55:08.80 ID:kVTWiMjF0\r\n20 () (W ad10-LBJI) sage 2022/11/06() 17:32:32.35 ID:tFbE0y020 \r\n16: 2023/01/03() 22:58:31.71 I\u2026 [+1169 chars]"
            },
            {
                "publishedAt": "2023-01-02T23:30:02Z",
                "author": "kurrism",
                "urlToImage": "https://livedoor.blogimg.jp/kurrism/imgs/6/7/67357cf1.png",
                "description": "532: U-名無しさん＠＼(^o^)／ ID:6UIcjSdY0  神奈川さん今年の高校サッカーもダメだったか    関東勢優勝回数  埼玉県☆☆☆☆☆☆☆☆☆☆☆☆☆  千葉県☆☆☆☆☆☆☆☆  東京都☆☆☆☆☆☆  茨城県☆☆  栃木県☆  群馬県☆  神奈川県  引用元: https://kizuna.5ch.net",
                "source": {
                    "name": "Worldfn.net",
                    "id": null
                },
                "title": "◆悲報◆関東で高校サッカーで優勝できないのは神奈川県だけ、今年も既に敗退",
                "url": "https://worldfn.net/archives/60072502.html",
                "content": "<table><tr><th>[Sponsored Link]\r\n <\/th><th>[Sponsored Link]\r\n <\/th><\/tr><tr><th><\/th><\/tr>\r\n<th><\/th>\r\n<\/table>\r\n546: U-(^o^) ID:kiVjGBvi0\r\n548: U-(^o^) ID:9NeajUZhd\r\n551: U-(^o^) ID:kiVjGBvi0\r\n817: \u2026 [+46 chars]"
            }
        ],
        "12238": [
            {
                "publishedAt": "2023-01-01T06:40:54Z",
                "author": "スポニチアネックス",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/6/a/6aca9_929_bcd72fcf_5af7ffd7.jpg",
                "description": "◇第67回全日本実業団対抗駅伝競走大会「ニューイヤー駅伝」（スポニチ後援）（2023年1月1日群馬県庁発着＝7区間、100キロ）東京都、埼玉県、千葉県で生鮮食品を中心としたスーパーマーケット・スーパーべルクス45店舗を展開する「サンベルクス」が過去の最高の15位に入った。3年連続5回目の出場で、これまで最高だった23位を大きく上回る15位でフィニッシュすると、応援していた買い物客がセールを期待してアクセスが殺到したのか、同社のホームページ（HP）がダウン。SNS上 全文スポニチアネックス 01月01日15時40分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "【ニューイヤー駅伝】セール期待でHP一時ダウン！？スーパー展開のサンベルクス過去最高15位",
                "url": "https://news.livedoor.com/article/detail/23472586/",
                "content": "672023117100\r\n4515\r\n352315HPSNS15\r\n12317228243261943152816??29216731115"
            },
            {
                "publishedAt": "2023-01-05T01:33:59Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230104003212_comm.jpg",
                "description": "【千葉】青いシャツが似た色の広い空に包まれ、物干し竿（ざお）にはためく。　県内唯一の村にあるカフェを訪ねると、敷地内の一角の小屋で藍染め工房「NORABI（ノラビ）」を営む品田彩来（しなだあやき）さ\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "プロサッカー選手から藍染め師へ　社会への疑問たどり見つけた「青」",
                "url": "https://www.asahi.com/articles/ASR147RJQQCVUDCB00K.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-01T08:26:34Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230101/K10013939631_2301011615_0101172636_01_02.jpg",
                "description": "厚生労働省によりますと、1月1日に発表した国内の新たな感染者は、空港の検疫などを含め8万6924人となっています。また国内で亡くなった人は、▽東京都で24人▽大阪府で20人▽北海道で17人▽福岡県で14人▽神奈川県で11人▽茨城県で10人▽兵庫県で9人▽長野県で9人▽山口県で8人▽岩手県で8人▽熊本県で8人▽三重県で7人▽京都府で7人▽千葉県で7人▽宮崎県で7人▽広島県で6人▽愛知県で6人▽佐賀県で5人▽埼玉県で5人▽大分県で5人▽岐阜県で5人▽岡山県で5人▽青森県で5人▽宮城県で4人▽秋田県で4人▽群馬県で4人\u2026",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "【新型コロナ厚労省まとめ】247人死亡 8万6924人感染（1日）",
                "url": "https://www3.nhk.or.jp/news/html/20230101/k10013939631000.html",
                "content": "11\r\n292994598692439985539186255159862141989865551418475314547161206737911378690356512894493711128873186123416120776999013310665795352760211213795441337525425432142466759170045512114464531271780408431\u2026 [+293 chars]"
            }
        ],
        "12208": [
            {
                "publishedAt": "2023-01-06T03:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/3782/53/ogp/d3782-53-c24c7e849b83b83cdd74-0.png",
                "description": "[株式会社CHINTAI]\n[画像1: https://prtimes.jp/i/3782/53/resize/d3782-53-c24c7e849b83b83cdd74-0.png ]\n\n千葉県出身の一戸選手は、トリノオリンピックにも出場した経験を持つ父、一戸剛（いちのへ・つよし）氏の影響で小学校5年...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "CHINTAIスキークラブの新たなメンバーとして、女子スキージャンプ 一戸くる実選手の所属が決定！1月8日（日）に大倉山ジャンプ競技場で新所属選手発表会を実施",
                "url": "https://prtimes.jp/main/html/rd/p/000000053.000003782.html",
                "content": "52022125360CHINTAI2026\r\n200462018\r\nN7\r\n2\r\nCHINTAICHINTAI2013201742022122220223CHINTAICHINTAI20231\r\nCHINTAICHINTAICHINTAICHINTAI\r\nCHINTAICHINTAI\r\n20231813W31274\r\nCHINTAI\r\nCHINTAI\r\nhttps://forms.gle/d1\u2026 [+339 chars]"
            },
            {
                "publishedAt": "2023-01-03T07:44:05Z",
                "author": null,
                "urlToImage": "https://blogimg.goo.ne.jp/user_image/44/04/f6d3a583c5233fb78ff84eaa21a04ac6.jpg",
                "description": "《新春！！明石【譲渡会】にゃんたフェ with カーロ 第108回》\nあけましておめでとうございます\nFan CAT猫まみれ～nekomamire～です。\n\n新春！1月7日(土曜日)明石の保護猫カフェカーロで猫の譲渡会を開催します。\n今年もどうぞよろしくお願いたします。\n\n今回は協力団体のにゃんたフェKOBEさんの主催です(内容はいつもと全く同じです)\n新しい年も、1匹でもご縁に導くため頑張ります。\n\n子猫たーーーーっくさん参加予定です。\n可愛い子を家族にお迎えください。\n\n明石市本町2-5-14　浜谷ビル2F\n\u2026",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "本日休業／チャー蔵にお年玉",
                "url": "https://blog.goo.ne.jp/kuru0214/e/a93e0e93cde5829aecb27f798f27e068",
                "content": "with 108Fan CATnekomamire\r\n17()\r\nKOBE()1\r\n2-5-142F1316\r\ning\r\n1000/1\r\nKOBEFan CATnekomamire\r\n()\r\n, \r\nmakunekojyoutokaigmail.com \r\n262-0032 \r\n&lt;svg width=\"50px\" height=\"50px\" viewBox=\"0 0 60 60\" vers\u2026 [+6122 chars]"
            },
            {
                "publishedAt": "2023-01-04T12:05:39Z",
                "author": null,
                "urlToImage": "https://blogimg.goo.ne.jp/user_image/24/b3/349e6eb72127680a7de85d889962c024.jpg",
                "description": "お正月も三が日を過ぎました。年末年始のために休館していた美術館の多くも今週末までに開館します。＊写真はサントリー美術館より。撮影用パネルの長谷川等伯の『楓図』。\n\n\n\n今月は興味深い展覧会がいくつも開幕します。見ておきたい展覧会をリストアップしてみました。\n\n展覧会\n\n・『マン・レイと女性たち』　神奈川県立近代美術館 葉山館（10/22～2023/1/22）\n・『アニメージュとジブリ展』　松屋銀座（1/3～1/23）\n・『国宝　雪松図と吉祥づくし』　三井記念美術館（12/1～2023/1/28）\n・『ドリーム／ラ\u2026",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "2023年1月に見たい展覧会【七福うさぎ/亜欧堂田善/エゴン・シーレ】",
                "url": "https://blog.goo.ne.jp/harold1234/e/fc9ec6ebde461163ba1cfecf803a6f18?fm=rss",
                "content": "10/222023/1/221/31/2312/12023/1/2812/182023/1/28Bunkamura 11/262023/1/29 11/262023/1/29)1/11/291/21/291/51/291/22/410/12023/2/51/72/122001/132/262022/11/122023/2/1912/152023/2/2612/172023/3/5202212/1\u2026 [+724 chars]"
            },
            {
                "publishedAt": "2022-12-29T02:30:45Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/2/3/23e76334-s.png",
                "description": "1: ケレス(千葉県) [CN] 2022/12/27(火) 15:18:40.90 ID:wAB3N2DC0● BE:237216734-2BP(2000)\n sssp://img.5ch.net/ico/tona1.gif 財務省は国債と借入金、政府短期証券を合計したいわゆる「国の借金」が1255兆1932億円だったと発表した。 3月末から13.9兆円増え、過去最多...",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "【悲報】国民1人あたりの借金「1000万円」突破ｷﾀ━━━━(ﾟ∀ﾟ)━━━━!!",
                "url": "http://news4vip.livedoor.biz/archives/52474445.html",
                "content": "1: () [CN] 2022/12/27() 15:18:40.90 ID:wAB3N2DC0 BE:237216734-2BP(2000)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1672121920/"
            },
            {
                "publishedAt": "2023-01-04T01:50:00Z",
                "author": "PR TIMES",
                "urlToImage": "https://prtimes.jp/img/91233/4/resize/d91233-4-f03a55878e41078e7cb4-0.jpg",
                "description": "キャッシュレス決済システムをご提供するジィ・シィ企画は、千葉県佐倉市が公募していた「佐倉市立美術館」のネーミングライツを取得し、2022年12月26日、同市とパートナー契約を締結いたしました。 これにより、2023年4月1日より2033年3月31日まで、同施設の愛称は「佐倉市立美術館！...GC」となります。プレスリリース",
                "source": {
                    "name": "Osdn.jp",
                    "id": null
                },
                "title": "「佐倉市立美術館」におけるネーミングライツパートナー契約の締結について",
                "url": "https://mag.osdn.jp/pr/23/01/04/105000",
                "content": "407320221226\r\n2023412033331\u2026GC\r\n\u2026GC()\u2026GC\u201c\u201d\r\n2023412033331\r\n210\r\n11()6(1994)11HP\r\nhttps://www.gck.co.jp/\r\n\u201c\u201d\u2026 GC \r\n1995 91343,16620226\r\nhttps://www.gck.co.jp/inquiry/URL\r\n: PR TIMES"
            }
        ],
        "12329": [
            {
                "publishedAt": "2022-12-29T07:46:00Z",
                "author": "サッカーダイジェストWeb",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/8/0/808ad_1429_328ae1c2_3a9a4226.jpg",
                "description": "日本サッカー協会（JFA）の公式YouTubeチャンネルJFATVが12月29日、「【ハイライト】決勝 柏レイソル(千葉県)vs.レジスタFC(埼玉県)｜JFA 第46回全日本U-12サッカー選手権大会」を公開した。26日に開幕し、48チームで争われた同大会。20分ハーフで、鹿児島県の白波スタジアムで行なわれたファイナルは、レジスタFCが前半４分と後半20分＋１分に佐藤泰旺がゴールを決めて２－０で快勝。見事に連覇を果たした。 決勝戦のハイライト動画を確認したファンからは、「埼玉県の誇 全文サッカーダイジェストWe\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "「レジスタ強すぎる」全日本U-12ファイナルのハイライト動画に称賛の声！「小学生でこのレベルはえぐい」",
                "url": "https://news.livedoor.com/article/detail/23460219/",
                "content": "JFAYouTubeJFATV1229 ()vs.FC()JFA 46U-12\r\n264820FC2011\r\nWeb\r\nU-12"
            },
            {
                "publishedAt": "2023-01-06T10:34:06Z",
                "author": "左右社",
                "urlToImage": "https://d2l930y2yx77uc.cloudfront.net/production/social_images/1db6e011f9e147e8cb95cf17b6fd171fea78e2cc.png",
                "description": "日本に住みながらルーマニア語で小説や詩を書いている日本人の小説家。 この文章を見て「なかなか面白い〈設定〉だね！」と言ってくれる人はいるだろう。だけども「へえ、そんなことが実際にあるんだね！」と言ってくれる人、つまりこの文章を「現実」のものと思ってくれる人はいるだろうか。「いや、そもそもルーマニアってどこの国?」と言ってくる人の方が多いんじゃあないかと感じる。しかし、こんな問いかけをする俺自身がその「日本に住みながらルーマニア語で小説や詩を書いている日本人の小説家」なんだ。 　 　まず少し、形式的な自己紹介をさせ\u2026",
                "source": {
                    "name": "Note.com",
                    "id": null
                },
                "title": "【無料公開】はじめに／済東鉄腸『千葉からほとんど出ない引きこもりの俺が、一度も海外に行ったことがないままルーマニア語の小説家になった話』より｜左右社｜note",
                "url": "https://note.com/sayusha/n/n8335fc5bcc57",
                "content": "?\r\nZ-SQUAD!!!!!LiterNauticaRevista Planeta Babel\r\n??Bram Stoker?Nadia Elena ComneciMircea Eliade 432Cristian MungiuEMEmil Mihai CioranTristan TzaraConstantin Brâncui?Nicolae CeauescuYouTube\r\na iubirz\u2026 [+27 chars]"
            },
            {
                "publishedAt": "2023-01-06T02:12:22Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/51782/399/ogp/d51782-399-61bde47db947b47d0c9e-0.jpg",
                "description": "[三井不動産株式会社]\n　三井不動産株式会社（所在：東京都中央区　代表取締役社長 菰田正信）は、1981年4月の開業以来、多くのお客さまにご愛顧いただいてまいりました「三井ショッピングパーク ららぽーとTOKYO-BAY (\u203b)」（千葉県船...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "三井ショッピングパーク ららぽーとTOKYO-BAY　建替え計画に伴い北館の一部（約70店舗）が2023年1月9日（月）をもって一時閉館",
                "url": "https://prtimes.jp/main/html/rd/p/000000399.000051782.html",
                "content": "19814 TOKYO-BAY ()70202319TOKYO-BAY\r\nTOKYO-BAY )\r\n67011202332URLhttps://www.mitsuifudosan.co.jp/corporate/news/2022/1130_01/\r\n TOKYO-BAY1981(1)SC 2 2 1 \r\n19882DC SC \r\n 1998\r\n19992109 \r\n2000321\r\n2001\r\u2026 [+480 chars]"
            },
            {
                "publishedAt": "2023-01-02T11:50:45Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230102/K10013940101_2301021951_0102205046_01_02.jpg",
                "description": "千葉県旭市の養鶏場でニワトリ30羽が死んでいるのが見つかり、千葉県が簡易検査を行った結果、鳥インフルエンザに感染している疑いがあることがわかりました。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "千葉 旭の養鶏場 簡易検査で陽性 鳥インフルエンザ感染の疑い",
                "url": "https://www3.nhk.or.jp/news/html/20230102/k10013940101000.html",
                "content": "30\r\n230\r\n31\r\n310\r\n61313\r\n1235220202021\r\n253\r\n177320202021987"
            },
            {
                "publishedAt": "2022-12-31T15:55:50Z",
                "author": null,
                "urlToImage": "https://s.togetter.com/ogp2/aca31b490d5b46648d9a8129e9640388-1200x630.png",
                "description": "2022年10月10日、千葉県で開催された格闘技イベント「千葉キック2022」で10歳未満の選手の試合が組まれたが、ヘッドギア無しだった。さすがに脳へのダメージを考えると、この試合形式はまずいので..",
                "source": {
                    "name": "Togetter.com",
                    "id": null
                },
                "title": "【格闘技】10歳未満の子供にヘッドギアなしの殴り合いをさせることは是か？",
                "url": "https://togetter.com/li/2029097",
                "content": "125kg22\r\n ///SMASHERS23kgSMASHERS25kg25vs///WINDY23kgSMASHERS25kgNJKF EXPLOSION 25kg"
            }
        ],
        "12207": [
            {
                "publishedAt": "2022-12-31T00:30:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221230004559_comm.jpg",
                "description": "千葉県や市町村の相談窓口などで2021年度に受け付けた移住相談は5197件に上り、新型コロナウイルスの感染が広がる前の19年度の2681件から倍増した。総務省のまとめでわかった。テレワークが浸透して\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "千葉への移住相談、コロナ前から倍増5197件　南房総地域が人気",
                "url": "https://www.asahi.com/articles/ASQDZ7DZQQDQUDCB001.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-06T01:48:11Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230105003833_comm.jpg",
                "description": "「どうもみなさん、こんにちば～」　元気よくあいさつするのは、お笑いコンビ「もぐもぐピーナッツ」のうっほ菅原さん（45）とばっしーさん（40）だ。吉本興業の地域活性化プロジェクトで、「千葉県住みます芸\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "「あいつら、売れたな」を夢見て　千葉県住みます芸人はねぎを育てる",
                "url": "https://www.asahi.com/articles/ASR157R8VQD5UDCB018.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            }
        ],
        "12409": [
            {
                "publishedAt": "2023-01-06T07:04:41Z",
                "author": "フルカウント",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/3/9/3971c_1397_d1608340_b9a622ea.jpg",
                "description": "福井から7月にソフトバンク入りも、わずか3か月で戦力外となった独立のベイサイドリーグに新規参入する千葉県民球団は6日、ソフトバンクを昨季限りで戦力外となった秋吉亮投手が選手兼投手コーチで入団すると発表した。コーチ歴はなく、指導は初めてとなる。秋吉は球団を通じて「NPBで9年間やってきたことを、NPBを目標にしている若い選手に、夢のプロ野球選手になれるように、しっかりと指導していきたいと思っています。また、選手としても、体がボロボロになるまで、最高のパフ 全文フルカウント 01月06日16時04分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "鷹戦力外の秋吉亮、独立L「千葉県民球団」で兼任コーチ　「体がボロボロになるまで」",
                "url": "https://news.livedoor.com/article/detail/23493819/",
                "content": "6\r\nNPB9NPB\r\n20133201920217NPB3Full-Count"
            },
            {
                "publishedAt": "2023-01-05T02:00:00Z",
                "author": "honwaka2ch",
                "urlToImage": "https://livedoor.blogimg.jp/honwaka2ch/imgs/7/e/7e3c1dad-s.jpg",
                "description": "44 名前：シャム(千葉県) [US][sage] 投稿日：2023/01/04(水) 16:34:24.77誰が一番稼いだんだ？投資とかは抜きで58 名前：ボンベイ(群馬県) [FR][sage] 投稿日：2023/01/04(水) 16:38:58.79>>44マイケルジョーダンやろ59 名前：イエネコ(埼玉県) [ZA][sage] 投稿日：2023/01/...",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "アスリートで誰が一番稼いだんだ？ 投資とかは抜きで",
                "url": "http://honwaka2ch.livedoor.biz/archives/10207192.html",
                "content": "44 () [US][sage] 2023/01/04() 16:34:24.7758 () [FR][sage] 2023/01/04() 16:38:58.79&gt;&gt;44\r\n59 () [ZA][sage] 2023/01/04() 16:39:05.63&gt;&gt;44\r\n67 () [][] 2023/01/04() 16:40:49.52&gt;&gt;44\r\n101 (\u2026 [+302 chars]"
            }
        ],
        "12443": [
            {
                "publishedAt": "2023-01-02T23:25:08Z",
                "author": "oggy0324",
                "urlToImage": "https://livedoor.blogimg.jp/oggy0324/imgs/3/e/3e7628a6.jpg",
                "description": "酒々井アウトレットに元旦から行ってきたサーヤです。こんばんみ。\nあのさ\u2026なんであんなに人がいるわけ？ビビるぜ。結局何が欲しいのかわからず\u2026パスポート持っていたけど何も買えず\u2026今回の一時帰国ではほぼ買い物ができなかったぁぁぁぁぁ！！！！\n\nさてさて、今日もし...",
                "source": {
                    "name": "Doorblog.jp",
                    "id": null
                },
                "title": "【里のMUJI みんなみの里】　at　千葉県鴨川市　～勝手に千葉観光大使日記～ 無印良品が運営する道の駅！",
                "url": "https://sayabangkok.doorblog.jp/archives/52361861.html",
                "content": "(-_-;)\r\n23\r\nMUJI JR15296-0112 +81-470-998055918URLhttps://www.muji.com/jp/ja/shop/detail/046602SNS"
            },
            {
                "publishedAt": "2023-01-06T04:17:39Z",
                "author": null,
                "urlToImage": "https://thebridge.jp/wp-content/themes/thebridge2019/assets/images/placeholder.svg",
                "description": "元メドレー 執行役員の加入により事業開発及び経営体制を強化 完全自動運転EV車両の開発・販売に取り組むTURING株式会社（千葉県柏市、代表取締役：山本 一成、以下「チューリング」）は、事業開発体制及び経営体制の強化を目指し、取締役COOとして田中大介を迎えました。新経営体制のもと、完全自動運転システムの社会実装・事業開発を更に加速させてまいります。 田中大介　TURING株式会社　取締役COO（...\nThe post 自動運転車開発のチューリング、取締役COOに田中大介が就任 first appeared o\u2026",
                "source": {
                    "name": "Thebridge.jp",
                    "id": null
                },
                "title": "自動運転車開発のチューリング、取締役COOに田中大介が就任",
                "url": "https://thebridge.jp/prtimes/468145",
                "content": "(C) THE BRIDGE, Inc. All Rights Reserved."
            }
        ],
        "12202": [
            {
                "publishedAt": "2023-01-06T01:41:06Z",
                "author": "himasoku123",
                "urlToImage": "http://himasoku.com/parts/ichiosi.png",
                "description": "1：白(千葉県) [CN]：2023/01/06(金) 03:59:29.85 ID:Kr9VsFI20●  自民 甘利氏\u201c少子化対策の財源 消費税率引き上げも検討対象\u201d #nhk_news https://t.co/trYKBJOWTa\u2014 NHKニュース (@nhk_news) January 5, 2023          6：カナダオオヤマネコ(茸) [CN]：2023/01/",
                "source": {
                    "name": "Himasoku.com",
                    "id": null
                },
                "title": "【速報】自民党「子育て支援のために消費税を上げる。ということも検討していく」",
                "url": "http://himasoku.com/archives/52209223.html",
                "content": "7() []2023/01/06() 04:04:02.59 ID:2ZJQ1m6f0\r\n62() []2023/01/06() 05:03:08.61 ID:K9XmoG4m0\r\n66() [IL]2023/01/06() 05:06:13.26 ID:H0GFaCd10\r\n🤔 \r\n67() []2023/01/06() 05:07:20.60 ID:lZmubb120\r\n78() [CN]\u2026 [+430 chars]"
            },
            {
                "publishedAt": "2023-01-05T02:30:00Z",
                "author": "PR TIMES",
                "urlToImage": "https://prtimes.jp/img/23654/246/resize/d23654-246-c19cc32b0847fc1170c2-0.png",
                "description": "～ 住民向けの情報提供にFAQ＆チャットボットMatchWebを活用 ～ NTTアドバンステクノロジは、千葉県安房郡鋸南町の住民向けにFAQサイト・チャットボットによる情報提供の実証実験を2023年1月5日から開始しました。 本実証実験では、NTT-ATが提供するQAテンプレートを活用して、住民からのよく寄せられる問い合わせや突発的に寄せられる問い合わせに対するFAQを充実させ、チャットという使いやすいUIで住民の疑問を解決することで、住民の満足度向上および町役場職員の問い合わせ対応業務の削減を目指します。プレス\u2026",
                "source": {
                    "name": "Osdn.jp",
                    "id": null
                },
                "title": "鋸南町におけるFAQサイト・チャットボットの実証実験を開始",
                "url": "https://mag.osdn.jp/pr/23/01/05/113003",
                "content": "FAQMatchWeb(R) \r\nNTTNTT-ATFAQ202315\r\nNTT-ATQAFAQUI\r\n13\r\nFAQ\r\nNTT-ATFAQFAQMatchWebFAQQA\r\n1MatchWeb FAQFAQAI FAQMatchWebFAQAI FAQFAQ\r\n22023152023331\r\nFAQMatchWeb\r\nMatchWebMatchContactSolutionFAQWebFAQF\u2026 [+58 chars]"
            },
            {
                "publishedAt": "2023-01-05T07:46:37Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "集客力の向上と持続可能な施設運営の実現に向けて、1月6日（金）より入園券販売・ベビーカー貸出しのオンライン化を開始観光・レジャー・文化施設向けにDXを推進するSaaS「ウラカタシリーズ」を提供するアソビュー株式会社（所在地：東京都品川区、代表執行役員CEO：山野智久、以下、当社）は、千葉市動物公園（千葉県千...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "アソビュー株式会社千葉市動物公園、アソビューが提供する電子チケットを導入",
                "url": "https://japan.cnet.com/release/30817375/",
                "content": "16\r\nDXSaaSCEO202316\r\n[: ]\r\n2014.....5..2,500202316\r\nAI\r\n202316 9001 700URL16\r\n202316 9001 250URL URL16\r\n198571207002021URL\r\n9,60060027,000\r\nURL\r\n2,500DXSaaS\r\n\u201c\u201dWell-BeingDX201131410CEO 1-11-28FDX\r\nPR\u2026 [+5 chars]"
            },
            {
                "publishedAt": "2023-01-01T19:34:56Z",
                "author": null,
                "urlToImage": "https://blogimg.goo.ne.jp/user_image/1d/0e/15053a723ee0630da6229fb242e404e3.jpg",
                "description": "【絶望禁止！】安保政策の大転換ストップは可能。反撃能力＝敵基地攻撃能力＝先制攻撃能力の具備や軍事費爆増は来年の通常国会で阻止できる。まともな野党を応援して、戦争を準備する予算案を否決しよう。\nこれからもぜひ一日一回、上下ともクリックしてくださると大変うれしいです！！！\n\nにほんブログ村\n社会・経済ニュースランキング\n\nAmazon　社会・政治・法律\nAｍazon　Kindle　ベストセラー\n \n \n　読者の皆様、明けましておめでとうございます！\n　この２０２３年もいろいろな意味で厳しい時期が続くと思いますが、精一\u2026",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "岸田首相の年頭所感『戦後日本が直面し積み残してきた多くの難しい問題、「先送りできない問題」に正面から立ち向か一つ一つ答えを出していく』。我々にとって先送りできない問題は自公政権の打倒そのものだ。",
                "url": "https://blog.goo.ne.jp/raymiyatake/e/c09d71adf417553fda1b9e0595becda5",
                "content": ""
            }
        ],
        "12441": [
            {
                "publishedAt": "2022-12-31T09:57:00Z",
                "author": "西日本スポーツ",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/b/8/b81c1_1498_1d1d8b9d_31b02a8a.jpg",
                "description": "全国高校サッカー選手権は31日、千葉県柏の葉公園総合競技場などで2回戦があり、初出場の飯塚（福岡）が1－0でノースアジア大明桜（秋田）を破って初勝利を飾った。6度の優勝を誇る国見（長崎）は0－0からのPK戦の末、4－3で尚志（福島）に勝って2005年度大会以来、17大会ぶりに3回戦へ進出。前回大会準優勝の大津（熊本）も1－1からPK戦に突入し、浜松開誠館（静岡）に4－3で勝利した。神村学園（鹿児島）はドイツ1部・ボルシアMG入りが決まっている福田師王（3年）の3大会連続ゴー 全文西日本スポーツ 12月31日18時\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "「大迫さんを超えたい」　神村学園・福田師王が見据えるのは\u201c半端ない\u201d先輩の記録【全国高校サッカー】",
                "url": "https://news.livedoor.com/article/detail/23469259/",
                "content": "31210600PK43200517311PK431MG3332312\r\nFW11138DF3\r\n3DF\r\n36239\r\n13221\r\n7506273110"
            },
            {
                "publishedAt": "2023-01-04T02:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/38857/78/ogp/d38857-78-c1a294b81e612997937f-0.jpg",
                "description": "[株式会社SkyDrive]\n[画像1: https://prtimes.jp/i/38857/78/resize/d38857-78-c1a294b81e612997937f-0.jpg ]\n\n\n■ プロジェクト推進の背景\n　日本の農林水産業は、国民の食料を安定に提供し、地域経済を支える重要な役割を担っていま...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "千葉県の物流ドローン等を活用した先進的な害獣駆除プロジェクトに参画",
                "url": "https://prtimes.jp/main/html/rd/p/000000078.000038857.html",
                "content": "20132023AI\r\n 2022AI&lt;2023&gt;\r\nAIDX\r\n SkyLift\r\n&lt;&gt;AI\r\nAI3rd-EYE Drone\r\nSkyLift\r\nOM-30\r\n3rd-EYE Center\r\nSkyLift<table><tr><td><\/td><td>2.5×1.9×1.01.9×1.2×1.0<\/td><\/tr><tr><td><\/td><td>35kg20kg<\u2026 [+549 chars]"
            }
        ],
        "12322": [
            {
                "publishedAt": "2022-12-30T23:57:35Z",
                "author": "goldennews",
                "urlToImage": "https://livedoor.blogimg.jp/goldennews/imgs/1/d/1d836236.jpg",
                "description": "1 ：ビッグクランチ(千葉県) [ﾆﾀﾞ] ：2022/12/31(土) 00:30:52.06 ID:HzsgZsVQ0 BE:754019341-PLT(12346)\n\n前日に新居と車が全焼\u2026レンタカー盗んだ容疑で男を逮捕　奈良県警 #朝日新聞デジタル https://t.co/3RdJp0yrgj\u2014 朝日新聞(asahi shimbun） (@asahi) December 30...",
                "source": {
                    "name": "Livedoor.jp",
                    "id": null
                },
                "title": "購入した家の入居準備中に段ボールを燃やし家と車が全焼→ホテルに無銭宿泊しレンタカーを窃盗した男を逮捕",
                "url": "http://blog.livedoor.jp/goldennews/archives/52208741.html",
                "content": "1() [] 2022/12/31() 00:30:52.06 ID:HzsgZsVQ0 BE:754019341-PLT(12346)\r\n#https://t.co/3RdJp0yrgj\r\n\u2014 (asahi shimbun (@asahi) December 30, 2022\r\n5() [] 2022/12/31() 00:33:57.32 ID:50IH+HJp0\r\n13() [VN] 20\u2026 [+3252 chars]"
            },
            {
                "publishedAt": "2022-12-31T07:33:27Z",
                "author": null,
                "urlToImage": "http://blog.cnobi.jp/v1/blog/user/08129a6aa5c0172a4540c0e91490e391/1672400043",
                "description": "先日29日、成田山新勝寺へ幸先詣に行ってまいりました\n「コロナもあるし、タフト君（我が家の愛車）の交通祈願もしたいから、今年も幸先詣に行こうよ」との妻の意見で、今年も年末に一足お先に千葉県・成田山新勝寺の「交通安全祈祷殿」へ車のお祓いと幸先詣に行ってきました。\n最上部の写真は、いざ着いてみると珍しく私たち夫婦しかいなくて、お坊様二人を夫婦で独り占め（二人占め？）して祈願をしてもらった時の様子です。\n静かな社殿に響いた読経に、心が洗われた思いです\u2026\n下の写真は、新勝寺の大本堂の様子です。\n\n\n\n人出の印象は、昨年よ\u2026",
                "source": {
                    "name": "Shinobi.jp",
                    "id": null
                },
                "title": "2022年、キンプリも訪れた成田山新勝寺から年末のご挨拶。今年もたいへんお世話になりました。",
                "url": "http://director.blog.shinobi.jp/Entry/17526/",
                "content": "202212(82)\r\n202211(75)\r\n202210(91)\r\n202209(85)\r\n202208(91)\r\n202207(96)\r\n202206(95)\r\n202205(119)\r\n202204(87)\r\n202203(102)\r\n202202(86)\r\n202201(98)\r\n202112(111)\r\n202111(146)\r\n202110(141)\r\n202109(103)\r\n2\u2026 [+2113 chars]"
            }
        ],
        "12204": [
            {
                "publishedAt": "2023-01-07T09:33:35Z",
                "author": null,
                "urlToImage": "https://blogimg.goo.ne.jp/user_image/1e/56/6acf12c8bd242c8c15af032224423616.jpg",
                "description": "第192回 にゃん☆ぴーす譲渡会\n\n【日時】１月８日（日） １３：００～１５：００\n (１４：３０までに入場ください)\n\n【場所】千葉県千葉市美浜区真砂1-2-6\n ピアシティ稲毛海岸 \n 『ペテモ ピアシティ稲毛海岸店 \n ドッグラン内』\n\n\n 【電車】京葉線 稲毛海岸駅 徒歩約10分\n\n 【車】ピアシティの駐車場をお使い下さい\n★下記ブログに、参加する猫、参加方法、譲渡条件等が載っていますので、ぜひご覧ください。\n\n『にゃん☆ぴーす』～千葉保護猫の家族探し～\n\n\n★にゃん☆ぴーすは、飼い主のいない猫を保護して\u2026",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "簡単更新／甘々のベロベロ",
                "url": "https://blog.goo.ne.jp/kuru0214/e/738f172ee176a3c0a3656f795128805f",
                "content": "192 ()\r\n1-2-6\r\n10\r\nm(_ _)m\r\n&lt;svg width=\"50px\" height=\"50px\" viewBox=\"0 0 60 60\" version=\"1.1\" xmlns=\"https://www.w3.org/2000/svg\" xmlns:xlink=\"https://www.w3.org/1999/xlink\"&gt;&lt;g stroke=\"none\"\u2026 [+2918 chars]"
            },
            {
                "publishedAt": "2023-01-06T01:17:34Z",
                "author": null,
                "urlToImage": "https://thebridge.jp/wp-content/themes/thebridge2019/assets/images/placeholder.svg",
                "description": "～インタビュー、編集、広報、フリーランススキルを学び、ライターの持続的なキャリアを実現～ ネコノテ合同会社（本社：千葉県袖ケ浦市、代表取締役：小宮山貴史）は、「書く」＋αのスキルを学ぶオンラインスクール『Marble（マーブル）』を開校いたしました。2022年12月15日より参加者を募集し、2023年2月より講座を開始いたします。■ Merbleとは 「書く」＋αのスキルを身につけて、...\nThe post 「書く」＋αのスキルに特化したオンラインスクール『Marble（マーブル）』を開校 first appe\u2026",
                "source": {
                    "name": "Thebridge.jp",
                    "id": null
                },
                "title": "「書く」＋αのスキルに特化したオンラインスクール『Marble（マーブル）』を開校",
                "url": "https://thebridge.jp/prtimes/468105",
                "content": "(C) THE BRIDGE, Inc. All Rights Reserved."
            }
        ],
        "12403": [
            {
                "publishedAt": "2022-12-29T08:15:56Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/d/5/d5f9df36-s.png",
                "description": "1: お前はVIPで死ねやゴミ(千葉県) [US]  2022/10/28(金) 10:50:41.78 ID:Cz+6AUib0● BE:509689741-2BP(6000)  sssp://img.5ch.net/ico/1fu.gif  近鉄が特急『あをによし』と『ひのとり』を増発　12月17日にダイヤ改正    近畿日本鉄道（近鉄）は10月12日、ダイヤ改正を12月",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "【悲報】上司「明日名古屋へ出張な」 俺「何時の新幹線ですか」 上司「は？近鉄で行けボケ」 俺「」",
                "url": "http://news4vip.livedoor.biz/archives/52474426.html",
                "content": "1: VIP() [US] 2022/10/28() 10:50:41.78 ID:Cz+6AUib0 BE:509689741-2BP(6000)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1666921841/"
            },
            {
                "publishedAt": "2023-01-04T08:13:56Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230104/K10013941041_2301041712_0104171357_01_02.jpg",
                "description": "厚生労働省によりますと、4日に発表した国内の新たな感染者は、空港の検疫などを含め10万4304人となっています。また国内で亡くなった人は、東京都で22人、大阪府で20人、神奈川県で17人、福岡県で16人、熊本県で15人、北海道で14人、愛知県で10人、千葉県で9人、宮崎県で9人、栃木県で7人、群馬県で7人、香川県で6人、高知県で6人、三重県で4人、岐阜県で4人、岡山県で4人、岩手県で4人、徳島県で4人、秋田県で4人、京都府で3人、兵庫県で3人、宮城県で3人、福井県で3人、長崎県で3人、佐賀県で2人、和歌山県で2人\u2026",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "【新型コロナ 厚労省まとめ】218人死亡 10万4304人感染 (4日)",
                "url": "https://www3.nhk.or.jp/news/html/20230104/k10013941041000.html",
                "content": "4104304\r\n222017161514109977664444443333322222222211121858162\r\n4\r\n29571931104304402627415542572097255200657165671862493582916244274991139464580130734403512890803379124729250070931243116757863698607482\u2026 [+370 chars]"
            },
            {
                "publishedAt": "2023-01-06T07:49:38Z",
                "author": null,
                "urlToImage": "https://car.watch.impress.co.jp/img/car/list/1468/612/001.jpg",
                "description": "ブリヂストンは、1月13日～15日の3日間、幕張メッセ（千葉県千葉市）で開催される「TOKYO AUTO SALON 2023」に出展する。",
                "source": {
                    "name": "Impress.co.jp",
                    "id": null
                },
                "title": "ブリヂストン、東京オートサロン2023出展概要 モータースポーツ活動60周年と連動したタイヤ・車両展示やトークショーなど実施",
                "url": "https://car.watch.impress.co.jp/docs/news/1468612.html",
                "content": "POTENZAPOTENZA RE47 1986POTENZA RE71 ENLITENBridgestone World Solar Challenge NTT INDYCAR SERIES \r\nPOTENZA POTENZAProdrive \r\nSUPER GT 2022 GT500 IMPUL ZPOTENZA RACING TIRE GT 2002 GT500 POTENZA RACIN\u2026 [+157 chars]"
            },
            {
                "publishedAt": "2022-12-29T05:30:54Z",
                "author": "ラジトピ",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/c/1/c10af_1736_1a83bef0_6c479db6.jpg",
                "description": "サッカー・J1のヴィッセル神戸は29日、J2・東京ヴェルディのMF井出遥也選手（28）が完全移籍で加入することが決まったと発表した。1994年3月25日生まれ、千葉県柏市出身の井出選手は、育成年代から注目を集めてきた、ドリブルを長所とするアタッカー。これまでアカデミーで育ったジェフユナイテッド市原・千葉をはじめ、ガンバ大阪、モンテディオ山形、東京ヴェルディでプレー。J1リーグ通算9試合出場、J2リーグ通算186試合出場22得点という実績を持つ。最近2シーズンはけがの影響 全文ラジトピ 12月29日14時30分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "J1神戸、東京VのMF井出遥也を獲得　ドリブルが武器のアタッカー「すべてをかけてヴィッセル神戸のために闘います」",
                "url": "https://news.livedoor.com/article/detail/23459657/",
                "content": "J129J2MF28\r\n1994325J19J21862222018GJ1E-girls"
            }
        ],
        "12203": [
            {
                "publishedAt": "2023-01-03T12:00:21Z",
                "author": "rebanila",
                "urlToImage": "https://livedoor.blogimg.jp/chaaaahan/imgs/c/a/ca7d9567.jpg",
                "description": "1: それでも動く名無し  2022/12/23(金) 01:58:25.56 ID:6K8E1fHv0  あと一つは？",
                "source": {
                    "name": "2chblog.jp",
                    "id": null
                },
                "title": "3大謎の土地「千葉県の下の方」「北海道の右の方」",
                "url": "http://oryouri.2chblog.jp/archives/10594990.html",
                "content": "1: 2022/12/23() 01:58:25.56 ID:6K8E1fHv0\r\n2: 2022/12/23() 01:58:48.32 ID:jWmzF+pUa\r\n3: 2022/12/23() 01:59:34.55 ID:OlVSUydS0\r\n4: 2022/12/23() 01:59:55.32 ID:HYRXDtUy0\r\n5: 2022/12/23() 01:59:55.79 ID:\u2026 [+2644 chars]"
            }
        ],
        "12206": [
            {
                "publishedAt": "2023-01-06T07:17:41Z",
                "author": null,
                "urlToImage": "https://thebridge.jp/wp-content/themes/thebridge2019/assets/images/placeholder.svg",
                "description": "～Society5.0での「誰一人取り残されない取組」として、スマホを活用した、会話する楽しみからの生きがいづくりを推進します～ 会話コミュニティ・サービス「Sail」を運営する株式会社Helte(本社：千葉県柏市、代表取締役：後藤 学、以下「Helte」)は、高知県高岡郡日高村（村長：戸梶 眞幸）が、スマホを使った公的サービスの質向上やデジタル活用での地域のコミュニケーション活性化に取り組む「村...\nThe post 高知県日高村の「村まるごとデジタル化事業」を共同で推進するために。株式会社Helteは連携協\u2026",
                "source": {
                    "name": "Thebridge.jp",
                    "id": null
                },
                "title": "高知県日高村の「村まるごとデジタル化事業」を共同で推進するために。株式会社Helteは連携協定に参画します。",
                "url": "https://thebridge.jp/prtimes/468189",
                "content": "(C) THE BRIDGE, Inc. All Rights Reserved."
            },
            {
                "publishedAt": "2023-01-03T23:25:39Z",
                "author": "oggy0324",
                "urlToImage": "https://livedoor.blogimg.jp/oggy0324/imgs/c/4/c4ce5429.jpg",
                "description": "げ、もうすぐ1月場所じゃんかー！早すぎる。サーヤです。こんばんみ。\n23年は一度はお相撲見に行きたいなぁぁぁ。目標は、名古屋か福岡\u2026（勝手に行く気）\nベトジェットの福岡行き\u2025\u2025どんな感じか乗ってみたいー！\n\n\nさてさて、今日も勝手に千葉観光大使日記。（そのうちク...",
                "source": {
                    "name": "Doorblog.jp",
                    "id": null
                },
                "title": "【道の駅「三芳村」鄙の里】　　at　千葉県南房総市　～勝手に千葉観光大使日記～ 新鮮なお野菜がリーズナブル！",
                "url": "https://sayabangkok.doorblog.jp/archives/52361889.html",
                "content": "IC6.5km10294-0814 +81-470-364116917URLhttps://www.hinanosato.jp/SNS"
            },
            {
                "publishedAt": "2022-12-31T14:00:46Z",
                "author": "himasoku123",
                "urlToImage": "http://himasoku.com/parts/ichiosi.png",
                "description": "1：ビッグクランチ(千葉県) [ﾆﾀﾞ]：2022/12/31(土) 20:32:31.21 ID:HzsgZsVQ0\n\n「死んで償うしかない」　盗撮疑いの市職員、銃刀法違反容疑でも逮捕 https://t.co/nYiV3TkUhV\u2014 産経ニュースＷＥＳＴ (@SankeiNews_WEST) December 31, 2022 \n\n \n20：熱的死(栃木県) [...",
                "source": {
                    "name": "Himasoku.com",
                    "id": null
                },
                "title": "【速報】市職員「死んで償うしかない」と切腹　罪状はJCのパンツ盗撮",
                "url": "http://himasoku.com/archives/52208795.html",
                "content": "24() [TW]2022/12/31() 20:37:32.42 ID:S7PIWE5D0\r\n26() [US]2022/12/31() 20:38:28.03 ID:9Q/8ZVL20\r\n31() [IR]2022/12/31() 20:39:26.20 ID:70idHcp90\r\n40() [US]2022/12/31() 20:42:51.18 ID:U4wl3bpm0\r\n54() [U\u2026 [+567 chars]"
            },
            {
                "publishedAt": "2022-12-31T10:49:00Z",
                "author": "西日本スポーツ",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/6/2/620c4_1498_d377a359_26e18a1e.jpg",
                "description": "全国高校サッカー選手権は31日、千葉県柏の葉公園総合競技場などで2回戦があり、初出場の飯塚（福岡）が1－0でノースアジア大明桜（秋田）を破って初勝利を飾った。6度の優勝を誇る国見（長崎）は0－0からのPK戦の末、4－3で尚志（福島）に勝って2005年度大会以来、17大会ぶりに3回戦へ進出。前回大会準優勝の大津（熊本）も1－1からPK戦に突入し、浜松開誠館（静岡）に4－3で勝利した。神村学園（鹿児島）はドイツ1部・ボルシアMG入りが決まっている福田師王（3年）の3大会連続ゴー 全文西日本スポーツ 12月31日19時\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "国見の成長は止まらない　2試合連続PK勝ちで17大会ぶりに3回戦へ【全国高校サッカー】",
                "url": "https://news.livedoor.com/article/detail/23469517/",
                "content": "31210600PK43200517311PK431MG3332312\r\nPK\r\n45PK2GK\r\n15PK\r\nOB2332\r\n3GK11FW"
            }
        ],
        "12205": [
            {
                "publishedAt": "2022-12-30T00:35:42Z",
                "author": "サッカーキング",
                "urlToImage": "https://www.soccer-king.jp/wp-content/uploads/2022/12/1228_1_054.jpg",
                "description": "記念すべき「選手権初勝利」。日本体育大学柏（千葉）にとって、芦屋学園（兵庫）を3－1で下した2022年12月29日は歴史的な一日となった。　屈指の激戦区である千葉県を勝ち抜いて初出場となった日体大柏の前評判は元より高い。「本当にレベルの高い選手が揃っている」と評したのは2回戦で対戦する丸岡（福井）の小阪康弘監督。柏レイソル入りの決まっているFWオウイエ・ウイリアム（3年）だけでなく、GKから各...",
                "source": {
                    "name": "Soccer-king.jp",
                    "id": null
                },
                "title": "選手権初出場・初勝利飾った日体大柏　強化につながる柏レイソルとの『Win－Win』の関係",
                "url": "https://www.soccer-king.jp/news/japan/highschool/20221230/1724453.html",
                "content": "J-GREENYANMAR CUP U-12 -#Football is Our Engine- 2022"
            },
            {
                "publishedAt": "2023-01-07T12:24:56Z",
                "author": "共同通信",
                "urlToImage": "https://news.livedoor.com/img/fb/news.png?v=20131122",
                "description": "バスケットボール男子のBリーグ1部（B1）は7日、愛知県のウィングアリーナ刈谷などで12試合が行われ、東地区首位の千葉Jは三河を95\u201579で退け、23勝4敗とした。同2位のA東京は川崎に75\u201564で勝ち、21勝6敗。中地区は横浜BCが琉球を67\u201551で破り、16勝11敗で川崎と並んだ。西地区は首位を走る広島が三遠を84\u201574で下して23勝5敗。島根は茨城に103\u201584で快勝し、21勝目（6敗）を挙げた。 全文共同通信 01月07日21時24分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "千葉Jが23勝目　バスケ男子Bリーグ1部",
                "url": "https://news.livedoor.com/article/detail/23500120/",
                "content": "B1B1712J95792342A7564216\r\nBC67511611847423510384216"
            }
        ]
    },
    "13": {
        "13208": [
            {
                "publishedAt": "2023-01-07T22:40:54Z",
                "author": "itsoku",
                "urlToImage": "https://livedoor.blogimg.jp/itsoku/imgs/a/1/a153fb85-s.png",
                "description": "1:バーマン(東京都) [US] 2023/01/07(土) 11:51:02.68 ID:atLzRRiX0● BE:971283288-PLT(14001)\nひろゆき氏「\u201cさすが百合子\u201dと言ってあげた方がいい　小池都知事の少子化対策「月5000円」に持論 https://news.yahoo.co.jp/articles/f22ba28a5d8b97e79b47c339522ba2ff3301...",
                "source": {
                    "name": "Livedoor.jp",
                    "id": null
                },
                "title": "ひろゆき「小池都知事の少子化対策、5000円からでもスタートしたこと自体は評価してさすが百合子と言ってあげた方がいい」",
                "url": "http://blog.livedoor.jp/itsoku/archives/60088570.html",
                "content": "1:() [US] 2023/01/07() 11:51:02.68 ID:atLzRRiX0 BE:971283288-PLT(14001)\r\n5000https://news.yahoo.co.jp/articles/f22ba28a5d8b97e79b47c339522ba2ff33011aec\r\n3:() [US] 2023/01/07() 11:53:17.78 ID:6jCQj0aU\u2026 [+2124 chars]"
            },
            {
                "publishedAt": "2023-01-08T02:45:16Z",
                "author": "ガジェット通信",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/9/b/9b851_242_3abf5293be6a75900659e0d3cf69eb29.jpg",
                "description": "昨年2022年末より、ネットを中心に話題となっている社会活動家・仁藤夢乃さんが代表をつとめる一般社団法人Colaboにまつわる騒動。1月4日には、\u201c暇空茜\u201cを名乗る男性が行っていた東京都の住民監査請求の結果が発表され、一部不当な点が認められるとの報告が行われた。その後も連日のようにSNSでは新しい話題が出る中で、1月6日にはあるユーザーが韓国の元慰安婦支援団体の2022年8月のスポンサー名簿、またドイツ慰安婦像の後援者としてColaboの名前があると指摘。2ちゃんねる創設者 全文ガジェット通信 01月08日11時\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "仁藤夢乃さん代表のColaboが韓国の元慰安婦支援団体やドイツ慰安婦像のスポンサーに？　SNSでの指摘にひろゆきさんは「 ほほぉ。」",
                "url": "https://news.livedoor.com/article/detail/23501778/",
                "content": "2022Colabo14SNS1620228Colabo2\r\n20228\r\n20228Twitter()\r\nhttps://jp.yna.co.kr/view/PYH20220831171800882[]\r\nColabo\r\nTwitterTwitterhttps://getnews.jp/archives/3372424[]"
            }
        ],
        "13209": [
            {
                "publishedAt": "2023-01-08T04:30:00Z",
                "author": null,
                "urlToImage": "https://img.news.goo.ne.jp/image_proxy/compress/q_80/picture/mainichi/s_mainichi-20230108k0000m020047000c.jpg",
                "description": "スギやヒノキなどの木材を主原料に、本革の風合いを再現した斬新な「ウッドレザー」を、京都の化学メーカー・サンノプコ（京都市東山区）が開発した。木材主体ながら柔らか...",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "木材主体の「ウッドレザー」開発",
                "url": "https://news.goo.ne.jp/topstories/business/999/8a31031aeb12b22a8a9431abbb5442f2.html?fr=RSS",
                "content": ""
            }
        ],
        "13121": [
            {
                "publishedAt": "2023-01-07T13:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221229003295_comm.jpg",
                "description": "日本の首都・東京は変わり続け、様々な側面を見せています。テレビ番組で東京の街を見つめ続ける高田純次さんに聞きました。東京とはどんなところなのでしょうか。　「じゅん散歩」も昨年9月で8年目に突入した。\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "「東京はアバンギャルド」　高田純次さんが「じゅん散歩」で見た街",
                "url": "https://www.asahi.com/articles/ASQDY6788QDNOXIE00C.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-08T04:00:43Z",
                "author": "tenki.jp",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/9/b/9b30d_1405_30ed2ab6fba04340cf7d3098d3dbfa88.jpg",
                "description": "きょう8日(日)も、東京都心は晴れて空気が乾燥。東京都心は、きのう7日(土)までに16日間連続で降水なし。空気カラカラ状態が続くため、火の元には十分に注意。火災予防や加湿ポイントは?東京都心16日間連続で降水なし3連休2日目のきょう8日(日)も、関東など太平洋側は晴れて、空気の乾燥した状態が続いています。太平洋側では、きのう7日(土)までの10日間の降水量は、平年の10%以下の所が多くなっています。東京都心は、昨年(2022年)12月23日から雨が降っていなく、きのう1月7日(土) 全文tenki.jp 01月0\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "東京都心　半月以上も降水なし　空気カラカラ　火の元注意　火災予防や加湿ポイントは",
                "url": "https://news.livedoor.com/article/detail/23502074/",
                "content": "8()7()16?\r\n16\r\n328()7()1010%\r\n(2022)122317()1616()1567()\r\n9()30%14%(712)\r\n5060%"
            },
            {
                "publishedAt": "2023-01-07T22:30:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230106003927_comm.jpg",
                "description": "徳川家康を祖とする徳川宗家の当主が1日、60年ぶりに代替わりした。29日には、徳川家の霊（れい）廟（びょう）がある東京都港区芝の増上寺で「継宗の儀」が催される。19代当主となった徳川家広さん（57）\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "徳川19代当主「家康役が松本潤さんで\u2026」　直接会って感じた期待",
                "url": "https://www.asahi.com/articles/ASR166JLSQDXOXIE025.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-08T01:00:00Z",
                "author": "4Gamer編集部",
                "urlToImage": "https://www.4gamer.net/games/476/G047609/20230106113/SS/001.jpg",
                "description": "プロジェクトセカイ カラフルステージ！ feat. 初音ミク プロジェクトセカイ カラフルステージ！ feat. 初音ミク   配信元 セガ 配信日 2023/01/08    『プロジェクトセカイ カラフルステージ！feat. 初音ミク』 「HAPPY BIRTHDAYライブ 志歩」 「[日野森志歩]HAPPY BIRTHDAYガチャ」開催！           株式会社セガ（本社：東京都品川区、代表取締役社長COO：杉野行雄）と株式会社Colorful Palette（本\u2026",
                "source": {
                    "name": "4gamer.net",
                    "id": null
                },
                "title": "「プロセカ」日野森志歩のHAPPY BIRTHDAYライブ＆ガチャを開催",
                "url": "https://www.4gamer.net/games/476/G047609/20230106113/",
                "content": "feat. HAPPY BIRTHDAY []HAPPY BIRTHDAY\r\nCOOColorful PaletteiOS/Android&amp; feat. 18HAPPY BIRTHDAY HAPPY BIRTHDAY \r\n2023180:0023:0018Leo/needCV.18HAPPY BIRTHDAY 0:001:002:008:0012:0018:0019:0020:0021:\u2026 [+444 chars]"
            }
        ],
        "13122": [
            {
                "publishedAt": "2023-01-07T13:00:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20221231000742_comm.jpg",
                "description": "変わり続ける首都・東京。東京という都市の実相を研究してきた社会学者の吉見俊哉教授に、東京の今や今後について聞いた。　　　　　◇",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "「東京は日本のリスクそのもの」　吉見俊哉教授が期待するものとは",
                "url": "https://www.asahi.com/articles/ASQD02HG0QDYOXIE00P.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-07T21:15:10Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/d/1/d1d6f1f5-s.png",
                "description": "1: クロスヒールホールド(東京都) [US]  2022/11/05(土) 13:29:23.42 ID:dRG7UvGD0● BE:227847468-2BP(1500)  sssp://img.5ch.net/ico/nida.gif  税金に怒る富裕層の声  「税金を取られても必要な時に何も支援がない。罰ゲームですか」    年収1000万円以上は富裕層などと呼",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "年収1000万円の富裕層「なんで私たちが努力して稼いだお金で努力不足の底辺を助けないといけないの」",
                "url": "http://news4vip.livedoor.biz/archives/52475551.html",
                "content": "1: () [US] 2022/11/05() 13:29:23.42 ID:dRG7UvGD0 BE:227847468-2BP(1500)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1667622563/"
            },
            {
                "publishedAt": "2023-01-08T01:30:33Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/e/4/e49798fa-s.png",
                "description": "1: アメリカンボブテイル(東京都) [CN]  2023/01/07(土) 01:02:14.27 ID:su6GfE+H0● BE:841987188-2BP(2000)  sssp://img.5ch.net/ico/2-1.gif  『いきなり!ステーキ』福袋　「誰が買うねん」と炎上中      内容は3000円で300円の割引券が13枚、合計3900円分が購入できると",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "いきなりステーキの福袋がマジで大盤振る舞いｗｗこれ大丈夫かよｗｗｗｗｗ",
                "url": "http://news4vip.livedoor.biz/archives/52475556.html",
                "content": "1: () [CN] 2023/01/07() 01:02:14.27 ID:su6GfE+H0 BE:841987188-2BP(2000)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1673020934/"
            }
        ],
        "13120": [
            {
                "publishedAt": "2023-01-07T21:00:00Z",
                "author": "スポニチアネックス",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/1/5/15208_929_20e18474_a160151f.jpg",
                "description": "◇第101回全国高校サッカー第6日・準決勝岡山学芸館3\u20153（PK4\u20151）神村学園（2023年1月7日国立）準決勝が国立競技場で行われ、2試合ともPK戦で決着した。岡山学芸館は3\u20153で突入したPK戦で、ドイツ1部ボルシアMG入りするFW福田師王（しおう、3年）を擁する神村学園（鹿児島）に4\u20151で勝利。GK平塚仁（2年）が福田のPKをストップする活躍で、初の決勝進出を決めた。東山（京都）は2大会連続で決勝進出を狙った大津（熊本）と対戦し、1\u20151で突入したPK戦を4\u20152で制し、初の決勝 全文スポニチアネックス 01月0\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "岡山学芸館　師王止めた！GK平塚が仁王立ち「3年生とまだ試合ができる」　激闘PK戦制し初の決勝進出",
                "url": "https://news.livedoor.com/article/detail/23500849/",
                "content": "101633PK41202317\r\n2PK33PK1MGFW341GK2PK211PK429\r\n23PK3\r\n2PK123\r\n31\r\n6514\r\n2WGKGKCK\r\n200517101217SCMIOGKJ506018473"
            },
            {
                "publishedAt": "2023-01-07T16:00:25Z",
                "author": "honwaka2ch",
                "urlToImage": "https://parts.blog.livedoor.jp/img/usr/cmn/ogp_image/livedoor.png",
                "description": "104 名前：ハイイロネコ(東京都) [US][] 投稿日：2023/01/07(土) 05:47:00.68 ID:8u5AM4s10https://imgur.com/C3O31jA.jpg「ヒーローたちが誰も助けない」w108 名前：マヌルネコ(神奈川県) [US][] 投稿日：2023/01/07(土) 05:52:15.58 ID:Z+oygV2b0>>104西川のりおの評価が爆...",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "ナイツ塙がオールスター感謝祭紳助ブチギレ事件を語る「あれはマジで怖かった」",
                "url": "http://honwaka2ch.livedoor.biz/archives/10208120.html",
                "content": "104 () [US][] 2023/01/07() 05:47:00.68 ID:8u5AM4s10https://imgur.com/C3O31jA.jpgw108 () [US][] 2023/01/07() 05:52:15.58 ID:Z+oygV2b0&gt;&gt;104\r\n113 () [US][] 2023/01/07() 05:59:17.50 ID:NC6oTe3K0&gt\u2026 [+406 chars]"
            },
            {
                "publishedAt": "2023-01-07T23:05:00Z",
                "author": "All About",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/8/b/8be26_300_957e77f0_2710dc66.jpg",
                "description": "東京都は、都内の中小企業1012社を対象に「賃金・退職金」に関する調査を行いました。結果は2022年7月31日時点の情報に基づいています。本記事では、都内の中小企業に勤める従業員（パート・アルバイトなどを除く）の平均月収・年収やボーナスについて紹介します。 都内の中小企業で働く人の平均月収は「39万円」都内の中小企業に勤める従業員の平均月収は「39万6357円」（平均年齢42.9歳、所定時間外賃金を含む）でした。平均年収は、「558万2454円」（所定時間外賃金、ボーナスなど 全文All About 01月08日\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "都内の中小企業、平均月収は「39万円」 ボーナスを含めた平均年収は？【東京都調査】",
                "url": "https://news.livedoor.com/article/detail/23501208/",
                "content": "10122022731\r\n39\r\n39635742.955824541049371189509941584100299411333555968534925545862\r\n193\r\n12021720226202140827120224211021079541937327104980264509910796991002991217234(: )"
            },
            {
                "publishedAt": "2023-01-07T23:00:52Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/b/7/b7d8e649-s.png",
                "description": "1: ベンガル(東京都) [US]  2023/01/06(金) 20:47:42.71 ID:9DuBP5IK0● BE:123322212-PLT(14121)  sssp://img.5ch.net/ico/pc3.gif  土曜出勤が問題？「中途採用応募ゼロ」中小企業の悩み    　A太さん（44）は従業員50人ほどの機械部品製造卸の中小企業で総務と経理の仕事",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "年間休日100日の中小企業「若者が中途採用に応募してくれない。どうしよう」",
                "url": "http://news4vip.livedoor.biz/archives/52475561.html",
                "content": "1: () [US] 2023/01/06() 20:47:42.71 ID:9DuBP5IK0 BE:123322212-PLT(14121)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1673005662/"
            }
        ],
        "13202": [
            {
                "publishedAt": "2023-01-07T21:41:57Z",
                "author": "Newtalk新聞 |林岑韋 綜合報導",
                "urlToImage": "https://s.yimg.com/ny/api/res/1.2/NjbxAWXRQ046V27NqK.R_g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD05MDA-/https://media.zenfs.com/zh-tw/newtalk.tw/3f9e6c99afc3981d644c5488f23b35f4",
                "description": "[Newtalk新聞] 中國疫情嚴峻，卻宣布今(8)日開始全面解封，對疫情傳染源和密切接觸者不再進行嚴格的隔離管理，並將新冠疫情改為「乙類乙管」。長榮航空表示，中國解封後，春節期間飛往大陸4航點的航班訂位率已近8成。 中國防疫大鬆綁，長榮航空指出，長榮/立榮航空飛航北京、上海、廈門、成都，於春節旺季區間整體訂位率皆已超過8成，航班數量將依相關規範及市場需求等做滾動式調整。而因應春節連假，中華航空表示，兩岸航線目前飛航4航點， 1月21日前上海浦東飛往桃園航線增為每日1班；北京飛往桃園航線為每週一班；成都及廈門飛往\u2026",
                "source": {
                    "name": "Yahoo Entertainment",
                    "id": null
                },
                "title": "中國大開國門！長榮航：春節飛大陸航班逾8成",
                "url": "https://tw.news.yahoo.com/%E4%B8%AD%E5%9C%8B%E5%A4%A7%E9%96%8B%E5%9C%8B%E9%96%80-%E9%95%B7%E6%A6%AE%E8%88%AA-%E6%98%A5%E7%AF%80%E9%A3%9B%E5%A4%A7%E9%99%B8%E8%88%AA%E7%8F%AD%E9%80%BE8%E6%88%90-054157578.html",
                "content": "6COVID-19(2019) 10 (Ernst Kuipers)COVID 427 COVID 6 COVID (Amsterdam Airport Schiphol)"
            }
        ],
        "13203": [
            {
                "publishedAt": "2023-01-08T01:10:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "（株）パステルコミュニケーション(本社:東京都豊島区、代表取締役:吉野加容子)が運営する、発達障害・グレーゾーンの子どもを育てるママがいつでも学べて相談できる月額制会員サイトNicotto!塾は、1月11日（水）12−13時で「発達凸凹キッズが幸せになるコミュニケーション力の授け方」を学ぶオンラインライブを開催いた...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社パステルコミュニケーション新春1/11子どもの発達障害グレーゾーンの子のママのためのお悩み解決子育てライブ開催～2022年パステル総研記事アクセスランキング発表～",
                "url": "https://japan.cnet.com/release/30817750/",
                "content": "(::)Nicotto!111121320221111 \r\n20221\r\n3\r\n2\r\n3\r\nTOP10 \r\n29Nicotto\r\n111NicottoNicotto!\r\n[1: ]\r\n111(1ZOOM\r\nZOOM 11 \r\nNicotto!Nicotto!Step1Step2Step3Nicotto!2980\r\n[2: ]\r\nIQ\r\n[3: ]\r\nNicottoNicotto! \r\n[4: ]\u2026 [+63 chars]"
            },
            {
                "publishedAt": "2023-01-08T03:00:51Z",
                "author": "岡本 裕明",
                "urlToImage": "https://object-storage.tyo1.conoha.io/v1/nc_e533f50b34984adfb3d5b5c849e46efe/agora-boject-storage/2023-01-iStock-528742744.jpg",
                "description": "小池都知事が18歳未満の子供を持つ家庭に一人月5000円の給付を始める検討を開始したとあります。このニュースのタイトルを見て、はじめに思ったこと。「おっ、東京都はもっと人口流入を増やしたいんだな」と。隣接県に住むより子供一人当たり年60,0\u2026",
                "source": {
                    "name": "Agora-web.jp",
                    "id": null
                },
                "title": "小池百合子流少子化対策の是非：東京の出生率が上がらない本当の原因とは",
                "url": "https://agora-web.jp/archives/230107103054-2.html",
                "content": "185000\r\n60,000\r\nbaphotte/iStock\r\n2001200\r\n20071525\r\n6-7\r\n20\r\n7-82\r\n/\r\n<ol><li>185000<\/li><li><\/li><li>23<\/li><li><\/li><\/ol>20\r\n202318"
            }
        ],
        "13401": [
            {
                "publishedAt": "2023-01-08T01:16:27Z",
                "author": "文春オンライン",
                "urlToImage": "https://newsatcl-pctr.c.yimg.jp/t/amd-img/20221215-00059414-bunshun-000-1-view.jpg?exp=10800",
                "description": "仁藤夢乃さんとColaboをめぐる騒動、「本当の問題」は何だったのか から続く 一方、一般社団法人「Colabo（コラボ）」をめぐっては、そもそも委託事業を出したり補助金・助成金を支給したりする東京都や国に問題はなかったのか、という論点もあります。 【写真】この記事の写真を見る（2枚） 本来、男女平等参画などジェ...",
                "source": {
                    "name": "Yahoo.co.jp",
                    "id": null
                },
                "title": "「地獄の門」と化したColabo騒動、東京都や国に問題はなかったのか（文春オンライン） - Yahoo!ニュース",
                "url": "https://news.yahoo.co.jp/articles/d66b00016d4144c950b3f571189f59ccd7b59e78",
                "content": "Colabo \r\nColabo\r\n2\r\nColabo422/"
            },
            {
                "publishedAt": "2023-01-07T12:52:00Z",
                "author": "日テレNEWS",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/7/2/7252f_1110_70b68eb7_255b5383.jpg",
                "description": "サッカー元日本代表の本田圭佑選手が7日、自身がGMを務めるサッカークラブ・EDO ALL UNITEDの2次セレクションに姿を見せました。「EDO ALL UNITED」は 2020年に本田選手が発起人となり設立されたサッカークラブ。東京都4部リーグ（J10相当）からスタートすると、20年から3年連続昇格を果たし、来シーズンから東京都1部リーグに（J7相当）に所属します。ゲーム形式の実戦テストと面接を経て、内定を受けた21名の選手が出席するミーティングに登場した本田選手は、心構えなどを熱弁しま 全文日テレNEWS\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "「東京にビッグクラブを作りたい」本田圭佑が自身のクラブ内定選手に熱弁「海外でプレーすることだって不可能じゃない」",
                "url": "https://news.livedoor.com/article/detail/23500196/",
                "content": "7GMEDO ALL UNITED2\r\nEDO ALL UNITED 20204J102031J7\r\n21\r\nJ1\r\nEDOEDO"
            },
            {
                "publishedAt": "2023-01-08T05:00:21Z",
                "author": "nwknews",
                "urlToImage": "https://livedoor.blogimg.jp/nwknews/imgs/6/2/62e37095.jpg",
                "description": "1: 三毛(東京都) [ﾇｺ] 2023/01/08(日) 12:15:36.17 ID:Z25DxNyW0● BE:837857943-PLT(17930)【悲報】2025年問題、マジでやばすぎるwwww【絶望】\n　タレントの中居正広が、昨年12月24日付で紺綬褒章飾版を受章したことが6日付の官報で発表された。　紺綬褒章は、公益のため私...",
                "source": {
                    "name": "Livedoor.jp",
                    "id": null
                },
                "title": "中居正広、紺綬褒章飾版を受章",
                "url": "http://blog.livedoor.jp/nwknews/archives/6003998.html",
                "content": "zarathustra1116@yahoo.co.jp"
            },
            {
                "publishedAt": "2023-01-07T14:25:00Z",
                "author": "ガジェット通信",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/8/3/83f76_242_eaab6c9f6c00d3797e17471b8d8c2872.jpg",
                "description": "1月4日、東京都は社会活動家・仁藤夢乃さんが代表をつとめる一般社団法人Colaboに関する住民監査請求について、一部不当な点があるとの結果を発表した。昨年よりネットを中心に騒動となっていたこの問題、公式に発表があったこともあり大手メディアも報じる。『夕刊フジ』にはネットで大騒ぎ「Ｃｏｌａｂｏ問題」めぐる税金の不適切な使われ方国は?弱者ビジネス?助長させる「困難女性支援法」を見直せhttps://www.zakzak.co.jp/article/20230106-3KTC6YUJBJORTOFO5IFIGBRFSM\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "有本香さんが夕刊フジで「国は〝弱者ビジネス〟助長させる『困難女性支援法』を見直せ」とColabo問題を斬る　暇空茜さん「ここが一番鋭い記事だね」",
                "url": "https://news.livedoor.com/article/detail/23500415/",
                "content": "14Colabo\r\nhttps://www.zakzak.co.jp/article/20230106-3KTC6YUJBJORTOFO5IFIGBRFSM/[]\r\nZAKZAK\r\nTwitter\r\nColabo\r\nTwitter\r\nhttps://getnews.jp/archives/3371997[]"
            }
        ],
        "13123": [
            {
                "publishedAt": "2023-01-08T04:46:37Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "日本最大級オンライン習い事カフェトーク世界87カ国からの講師と、130カ国からレッスンを探す生徒をつなぐ日本最大級オンライン習い事サイト「カフェトーク（http://cafetalk.com/）」を運営する株式会社スモールブリッジ（本社：東京都渋谷区、代表取締役：橋爪小太郎）は、2023年1月20日(金) 20時30分、英語学習者向け...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社スモールブリッジ【英語セミナー】「今年こそ３日坊主を避けたいあなたが知るべき行動を習慣にするための知識と思考」開催",
                "url": "https://japan.cnet.com/release/30817758/",
                "content": "871302023120() 2030\r\n[1: ]\r\nYoshi.sensei\r\n[2: ]\r\n[3: ]\r\nYoshi\r\n2023120() 2030 ()30800880\r\nYoshi.sensei\r\n[4: ]\r\nZoom90\r\n1-21-1 SHIBUYA SOLASTA 3F\r\ninfo@cafetalk.com\r\nPR TIMES"
            },
            {
                "publishedAt": "2023-01-08T07:12:23Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230108001702_comm.jpg",
                "description": "2年前、新型コロナで成人式を見送った東京都世田谷区は、「成人の日」を翌日に控えた8日、当時の新成人を対象に「22歳のつどい」と題した式典を開いた。参加者たちは、当時着られなかった振り袖の人の姿も交じ\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "「なくなったと思ったけど\u2026」コロナで2年遅れの「成人式」　世田谷",
                "url": "https://www.asahi.com/articles/ASR1853R6R18UTIL00B.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-07T21:45:52Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/d/1/d1d6f1f5-s.png",
                "description": "1: クロスヒールホールド(東京都) [US]  2022/11/05(土) 13:29:23.42 ID:dRG7UvGD0● BE:227847468-2BP(1500)  sssp://img.5ch.net/ico/nida.gif  税金に怒る富裕層の声  「税金を取られても必要な時に何も支援がない。罰ゲームですか」    年収1000万円以上は富裕層などと呼",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "年収1000万円の富裕層「なんで私たちが努力して稼いだお金で努力不足の底辺を助けないといけないの」",
                "url": "http://news4vip.livedoor.biz/archives/52475552.html",
                "content": "1: () [US] 2022/11/05() 13:29:23.42 ID:dRG7UvGD0 BE:227847468-2BP(1500)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1667622563/"
            },
            {
                "publishedAt": "2023-01-08T07:12:23Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230108001702_comm.jpg",
                "description": "2年前、新型コロナで成人式を見送った東京都世田谷区は、「成人の日」を翌日に控えた8日、当時の新成人を対象に「22歳のつどい」と題した式典を開いた。参加者たちは、当時着られなかった振り袖の人の姿も交じ\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "「なくなったと思ったけど\u2026」コロナで2年遅れの「成人式」　世田谷",
                "url": "https://www.asahi.com/articles/ASR1853R6R18UTIL00B.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            }
        ],
        "13201": [
            {
                "publishedAt": "2023-01-08T02:45:57Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/f/e/fe58ef0a.png",
                "description": "1: 以下、ニュー速クオリティでお送りします  2022/06/19(日) 12:47:22.11 ID:Mvz41DRA0  特殊詐欺に関与したとみられる新婚の主婦が逮捕された。    武田絵理華容疑者（30）は5月、東京都内に住む90代の男性に仲間らと嘘の電話をかけ、キャッシュカード1枚を盗み、50万円を",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "【画像】新婚の美人女さん（30）、特殊詐欺で逮捕され全てを失う・・・・・・・・・",
                "url": "http://news4vip.livedoor.biz/archives/52475458.html",
                "content": "1: 2022/06/19() 12:47:22.11 ID:Mvz41DRA0"
            }
        ],
        "13206": [
            {
                "publishedAt": "2023-01-08T05:17:26Z",
                "author": null,
                "urlToImage": "https://thebridge.jp/wp-content/themes/thebridge2019/assets/images/placeholder.svg",
                "description": "米・スタンフォード大学発のスタートアップ企業であり、ワイヤレス給電によって配線のない\u201cデジタル社会\u201dの実現を目指すエイターリンク株式会社（本社：東京都千代田区、代表取締役：岩佐凌、田邉勇二以下エイターリンク）は、1月3日、1月5日～1月8日（現地時間）に、米国ネバダ州ラスベガス市で開催される世界最大のデジタル関連の展示会である「CES 2023」に出展いたします。エイターリンクは米国スタンフォード...\nThe post 空間伝送型ワイヤレス給電技術の社会実装を実現するエイターリンク 世界初の空間伝送型ワイヤレス\u2026",
                "source": {
                    "name": "Thebridge.jp",
                    "id": null
                },
                "title": "空間伝送型ワイヤレス給電技術の社会実装を実現するエイターリンク 世界初の空間伝送型ワイヤレス給電技術「AirPlug(TM)」をCES 2023で発表",
                "url": "https://thebridge.jp/prtimes/468348",
                "content": "131518CES 202320cm10001AirPlug™FA\r\nCES 2023AirPlug™ CO2 20229\r\nAirPlug™AirPlug™AirPlug™ Power TxAirPlug™ SenseAirPlug™ Sumit3\r\n5CO2250\r\nWPTWireless Power TransferAirPlug™ Sense\r\n30SDGs\r\nWPTWireless P\u2026 [+1693 chars]"
            }
        ]
    },
    "14": {
        "14382": [
            {
                "publishedAt": "2023-01-06T08:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「バイオ燃料市場 - 世界の業界分析、規模、シェア、成長、動向、予測（2022年～2031年）」（Transparency Market Research）の販売を1月6日より開始いたしました。",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーションバイオ燃料市場、2031年末までに3,318億1,000万米ドルの規模に達する見込み",
                "url": "https://japan.cnet.com/release/30817542/",
                "content": "20211,3168,0002022203111.5CAGR20313,3181,000\r\n2031\r\nEURED20151050602021165\r\nTEL044-952-01029:00-18:00 URL\r\n1995520015\r\n1995215-00041-2-37F\r\n202012244171"
            },
            {
                "publishedAt": "2023-01-05T03:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "インバースネット株式会社（本社：神奈川県横浜市神奈川区新浦島町1-1-25、代表取締役社長：山本 慶次郎）（以下、当社）は、オリジナルBTOパソコンブランド「FRONTIER」から第13世代インテル Core プロセッサーを搭載したパソコンの販売を2023年1月4日（水）より開始しています。■製品の概要このたび販売を開始する製品...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "インバースネット株式会社【FRONTIER】第13世代インテル Core プロセッサー搭載PC販売開始",
                "url": "https://japan.cnet.com/release/30817294/",
                "content": "1-1-25 BTOFRONTIER13 Core 202314\r\n13 Core Raptor Lake-S3\r\nFRONTIER 202314\r\n13 CorePCGA GH GB [: ]\r\n13 Core13 Core Raptor Lake-SP-coreE-coreE-core700600Core i9-13900F24(P-core:8E-core:16)325.6GHz13 Co\u2026 [+164 chars]"
            },
            {
                "publishedAt": "2023-01-06T03:40:11Z",
                "author": null,
                "urlToImage": "https://thebridge.jp/wp-content/themes/thebridge2019/assets/images/placeholder.svg",
                "description": "～TikTok LIVEでの配信を強化～ ULTRA SOCIAL株式会社（本社：神奈川県横浜市、代表取締役社長：高橋亮太）が、2023年1月6日に、日本有数のトップライバー「ひのえんま」とTikTok LIVEにおける専属所属契約を締結しましたことをお知らせいたします。それに伴い、TikTokのアカウントを開設いたします。 @ひのえんま https://www.tiktok.com/@hinoe...\nThe post 日本トップライバー「ひのえんま」ULTRA SOCIALが運営するクリエイターエージェンシー\u2026",
                "source": {
                    "name": "Thebridge.jp",
                    "id": null
                },
                "title": "日本トップライバー「ひのえんま」ULTRA SOCIALが運営するクリエイターエージェンシーCue\u2019sに所属契約締結",
                "url": "https://thebridge.jp/prtimes/468129",
                "content": "(C) THE BRIDGE, Inc. All Rights Reserved."
            }
        ],
        "14383": [
            {
                "publishedAt": "2023-01-06T01:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "マップ・情報提供・通知・リッチなアイデア投稿ほか、新UI/UXで市民参加プロセスづくりを強力にサポート株式会社Liquitous（本社：神奈川県横浜市、代表取締役CEO：栗本 拓幸）は、独自開発する市民参加型合意形成プラットフォーム「Liqlid」について、Liqlidを各地域で展開する中でいただいた市民や行政職員の皆さんの...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社LiquitousLiquitous、市民や行政職員の皆さんのアイデアや声をもとに、独自開発の市民参加型合意形成プラットフォーム「Liqlid」の新規バージョンをリリース",
                "url": "https://japan.cnet.com/release/30817453/",
                "content": "UI/UX\r\nLiquitousCEO LiqlidLiqlidUI/UXVersion 2.0\r\nLiqlidVersion 2.0\r\nLiqlidLiquitousLiqlid[1: ]\r\nLiqlidVersion 2.0Version 2.0LiqlidUI/UXLiqlidVersion 2.0\r\nLiqlidVersion 2.0\r\nLiqlidVersion 2.0UIUX\r\n[2\u2026 [+395 chars]"
            }
        ],
        "14133": [
            {
                "publishedAt": "2023-01-05T02:40:11Z",
                "author": null,
                "urlToImage": "https://thebridge.jp/wp-content/themes/thebridge2019/assets/images/placeholder.svg",
                "description": "神奈川県西部に位置する小田原市。目の前に広がる相模湾は日本最大深湾の一つと呼ばれ、四季折々の豊富な魚種が水揚げされています。 同市にある「千両寿司」は、高い技術を持つ店主がネタとシャリを絶妙なバランスで握るカウンター寿司をいただける寿司店。この度、店主の高齢化により、長らく愛されてきた寿司店の後継者を募集します。 今回の後継者募集について 事業承継マッチングプラットフォーム「relay（リレイ）」...\nThe post 神奈川県小田原市の寿司屋「千両寿司」が「事業承継マッチングプラットフォームrelay（リレイ\u2026",
                "source": {
                    "name": "Thebridge.jp",
                    "id": null
                },
                "title": "神奈川県小田原市の寿司屋「千両寿司」が「事業承継マッチングプラットフォームrelay（リレイ）」で後継者を募集。",
                "url": "https://thebridge.jp/prtimes/467973",
                "content": "(C) THE BRIDGE, Inc. All Rights Reserved."
            },
            {
                "publishedAt": "2023-01-07T03:04:33Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230107/K10013943631_2301071041_0107120434_01_02.jpg",
                "description": "7日未明、神奈川県平塚市の市道で50代の男性が倒れているのが見つかり、まもなく死亡が確認されました。車にひかれた跡があることから、警察はひき逃げ事件として捜査しています。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "50代男性が車道で死亡 ひき逃げ事件として捜査 神奈川 平塚",
                "url": "https://www3.nhk.or.jp/news/html/20230107/k10013943631000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-05T00:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「バイオリアクターの世界市場 (2023年～2032年)：市場規模 (製品・細胞・分子・用途・エンドユーザー別)・地域別展望・成長の潜在性・競合市場シェア・予測」（Global Market ...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーションバイオリアクター市場：幹細胞分野が2032年にかけてCAGR12.5%で成長予測",
                "url": "https://japan.cnet.com/release/30817050/",
                "content": "20232032\r\nCOVID-192032CAGR15.5\r\n20232032CAGR12.5%\r\n2032\r\n2032\r\n2032\r\nDanaher CorporationThermo Fisher ScientificGetinge (Applikon Biotechnology)CESCO BioengineeringBbi BiotechShanghai Bailun Biotechn\u2026 [+143 chars]"
            },
            {
                "publishedAt": "2023-01-08T01:33:26Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230106004474_comm.jpg",
                "description": "神奈川県鎌倉市の里山で竹の花が咲いた。横浜市こども植物園によると、開花は60年から120年に一度とも言われているという。　竹の花を見つけたのは鎌倉市十二所の伊藤淳子さん（66）。昨年末、所有する近く\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "開花は120年に一度？珍しい竹の花が鎌倉に咲く　発見者も驚き",
                "url": "https://www.asahi.com/articles/ASR1675HCR15ULOB005.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            }
        ],
        "14210": [
            {
                "publishedAt": "2023-01-05T01:10:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "ニューロテクノロジーの研究開発促進のために、イヤホン型脳波計と脳波解析プログラムを販売　次世代型ウェアラブル・イヤホン型脳波計の開発とニューロテクノロジーの社会実装を行うVIE STYLE株式会社（代表取締役: 今村 泰彦、本社所在地: 神奈川県鎌倉市、以下VIE STYLE（ヴィー スタイル））は、研究者及び共同研究...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "VIE STYLE株式会社VIE STYLE、イヤホン型脳波計と脳波解析プログラムを提供開始",
                "url": "https://japan.cnet.com/release/30817223/",
                "content": "VIE STYLE: : VIE STYLE \r\n[1: ]\r\nWindowsVIE ZONE1BluetoothCSVαMATLABAI\r\nR&amp;D[2: ]\r\n[1: ]\r\n. . . BTWindowsStatistics and Machine Learning ToolboxParallel Computing Toolbox\r\nVIE ZONE\r\nVIE STYLEVIE ZO\u2026 [+75 chars]"
            },
            {
                "publishedAt": "2023-01-05T06:00:12Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/27211/77/ogp/d27211-77-8a99472f78dba84dc6fa-1.jpg",
                "description": "[株式会社成城石井]\n[画像1: https://prtimes.jp/i/27211/77/resize/d27211-77-8a99472f78dba84dc6fa-1.jpg ]\n\n\n\n　株式会社成城石井(本社事務所：神奈川県横浜市西区北幸、代表取締役社長：原昭彦)は、2023月1月13日(金)から1月31日...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "1月15日(日)の「いちごの日」に合わせ、成城石井初の「いちごフェア」を開催",
                "url": "https://prtimes.jp/main/html/rd/p/000000077.000027211.html",
                "content": "()2023113()131()202() .com( http://www.seijoishii.com/ )Le Bar a Vin 52 AZABU TOKYO \r\n1151()15()JA79()1322\r\n(//) () () ()(/) () () () (/)17097\r\n6321 ()() \r\n ()1863\r\n113()  72%\r\n120 1323\r\n111() 11,070\u2026 [+615 chars]"
            }
        ],
        "14342": [
            {
                "publishedAt": "2023-01-08T05:11:32Z",
                "author": "BASEBALL KING",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/5/1/51762_1424_86ce2218_d0fbe542.jpg",
                "description": "DeNAの新人合同自主トレが8日、神奈川県横須賀市内のDOCK OF BAYSTARS YOKOSUKAでスタートした。視察に訪れた三浦監督は、育成を含む新人10選手に訓示。三浦監督は「入団発表の時にも話をしているけれども、今の気持ち、入団発表の時の気持ち、今日グラウンドで動き始めた時の気持ち、キャンプインしてユニホームを着て動き始めた時の気持ち。今年1年全てがみんなにとって初めての体験だと思うけど、感じたこと、どういう気持ちで横須賀にグラウンドに来たか、どういう気持ちでユ 全文BASEBALL KING 01月\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "DeNA・三浦監督、新人10選手に考えることの重要性を説く「工夫してどれだけ自分のものにしていくか」",
                "url": "https://news.livedoor.com/article/detail/23502281/",
                "content": "DeNA8DOCK OF BAYSTARS YOKOSUKA\r\n101110\r\n1"
            },
            {
                "publishedAt": "2023-01-06T08:40:03Z",
                "author": "株式会社OSHIRI",
                "urlToImage": "https://prtimes.jp/common/pc_v4/og.png",
                "description": "[株式会社OSHIRI]\n\nおしり工場紹介\n\nOSHIRI Factory（通称：おしり工場）とは、神奈川県川崎市多摩区登戸にある、納品されたお尻を育成から製品化までして出荷している、ヒップアップに特化したフィットネスジムです。\n若年層向け...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "おしりトレーニングのオンラインレッスン【おしりオンライン】1/8（日）スタート",
                "url": "https://prtimes.jp/main/html/rd/p/000000004.000093653.html",
                "content": "OSHIRI FactoryOSHIRI\r\nTHE PEACHes \u201c\u201c\r\nOSHIRI\r\nPC\r\nOHIRI\r\nOSHIRI4800\r\n212111\r\nhttps://coubic.com/squatlabo/products/392947\r\nTHE PEACHes"
            },
            {
                "publishedAt": "2023-01-07T10:54:42Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/9/8/985a2_1509_420ca8d6_3886b07f.jpg",
                "description": "新型コロナウイルスの国内感染者は7日午後7時現在、新たに23万8668人が確認された。前週の同じ曜日（12月31日）より13万2233人多かった。死者は387人で、山梨（6人）、愛媛（10人）、熊本（20人）、大分（8人）の4県で過去最多だった。都道府県別に新規感染者数を見ると、東京都が最も多く1万9630人だった。大阪府の1万6704人、愛知県の1万5774人、福岡県の1万3963人、神奈川県の1万2840人が続いた。静岡県（9475人）と岡山県（5332人）では新規感染者数が過去最多を更新した。 全文朝日新聞\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "新型コロナ、全国で23万8668人が感染　4県で死者が過去最多に",
                "url": "https://news.livedoor.com/article/detail/23499816/",
                "content": "77238668\r\n12311322333876102084\r\n196301670415774139631284094755332"
            },
            {
                "publishedAt": "2023-01-06T05:16:43Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "SNSの技術屋集団がお伝えするSNSマーケティング手法！「PLACOLE & DRESSY」ブランドを展開する、冒険社プラコレ(本社：神奈川県鎌倉市、代表取締役CEO：武藤功樹)は、「総フォロワー数84万人」と「累計250社以上のSNS運用、マーケ実績」を活かし『ファン・フォロワーに喜ばれる共感されるコンテンツを投稿するSNS特別セ...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "冒険社プラコレ【1/26(木)27(金)無料セミナー】ファン・フォロワーに喜ばれる共感されるコンテンツを投稿する方法は？今月もSNS特別セミナーを実施！",
                "url": "https://japan.cnet.com/release/30817575/",
                "content": "SNSSNS\r\nPLACOLE &amp; DRESSY(CEO)84250SNSSNS\r\n84250SNS\r\nSNS2023183203020171@placole_dressy211@weddingadviser,@farny_wedding,@dressy_idea7TikTok116Instagram31SNS84\r\n[1: ]\r\nSNSSNSSNS84\r\n[2: ]\r\n[: ]\r\nSN\u2026 [+1229 chars]"
            },
            {
                "publishedAt": "2023-01-06T04:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「ハードウェア暗号化の世界市場：製品種類別 (外付けHDD、内蔵HDD、SSD、インラインネットワーク暗号化装置、USBフラッシュドライブ)・用途別 (家電、航空宇宙・防衛、交通機...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーションハードウェア暗号化市場、2027年に3億5700万米ドル到達予測",
                "url": "https://japan.cnet.com/release/30817320/",
                "content": "2021271002022CAGR4.8202735700\r\nCAGR\r\nSSD20222027CAGRSSD\r\nITSSD\r\n29AIMLITPCUSB\r\nTEL044-952-01029:00-18:00 URL\r\n1995520015\r\n1995215-00041-2-37F\r\n202012244171"
            }
        ],
        "14134": [
            {
                "publishedAt": "2023-01-07T16:00:25Z",
                "author": "honwaka2ch",
                "urlToImage": "https://parts.blog.livedoor.jp/img/usr/cmn/ogp_image/livedoor.png",
                "description": "104 名前：ハイイロネコ(東京都) [US][] 投稿日：2023/01/07(土) 05:47:00.68 ID:8u5AM4s10https://imgur.com/C3O31jA.jpg「ヒーローたちが誰も助けない」w108 名前：マヌルネコ(神奈川県) [US][] 投稿日：2023/01/07(土) 05:52:15.58 ID:Z+oygV2b0>>104西川のりおの評価が爆...",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "ナイツ塙がオールスター感謝祭紳助ブチギレ事件を語る「あれはマジで怖かった」",
                "url": "http://honwaka2ch.livedoor.biz/archives/10208120.html",
                "content": "104 () [US][] 2023/01/07() 05:47:00.68 ID:8u5AM4s10https://imgur.com/C3O31jA.jpgw108 () [US][] 2023/01/07() 05:52:15.58 ID:Z+oygV2b0&gt;&gt;104\r\n113 () [US][] 2023/01/07() 05:59:17.50 ID:NC6oTe3K0&gt\u2026 [+406 chars]"
            },
            {
                "publishedAt": "2023-01-07T05:35:51Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230107/K10013943771_2301071431_0107143552_01_02.jpg",
                "description": "7日朝、神奈川県相模原市で緊急走行中だった救急車が交差点でバイクと衝突し、バイクを運転していた会社員の男性が死亡しました。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "救急車とバイク衝突 バイク運転の男性死亡 緊急走行中 神奈川",
                "url": "https://www3.nhk.or.jp/news/html/20230107/k10013943771000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-05T02:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「容積式送風機の世界市場 (2023年～2032年)：市場規模 (製品・エンドユーザー別)・COVID-19の影響・地域別展望・成長の潜在性・価格動向・競合市場シェア・予測」（Global Mar...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーション容積式送風機市場：水・廃水処理部門が2032年にかけてCAGR5.5%で成長予測",
                "url": "https://japan.cnet.com/release/30817052/",
                "content": "2032\r\n201710HowdenSiemens\r\n20232032CAGR5.5%\r\n2032\r\n80%90%203040%\r\n2032\r\nEurus BlowersBusch SEGardner DenverAerzenHowden GroupTuthill CorporationKaeser KompressorenAirtech Blower IndustriesAMCL Machin\u2026 [+99 chars]"
            }
        ],
        "14211": [
            {
                "publishedAt": "2023-01-06T02:06:19Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230106001433_comm.jpg",
                "description": "5日午後10時40分ごろ、神奈川県松田町松田惣領の会社員古谷好人さん（49）方から出火し、木造2階建て住宅が全焼した。焼け跡から男児とみられる遺体が見つかった。この家に住む長男（10）と連絡がとれて\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "住宅が全焼、焼け跡から男児とみられる遺体　神奈川県松田町",
                "url": "https://www.asahi.com/articles/ASR163PGGR16ULOB002.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            }
        ],
        "14101": [
            {
                "publishedAt": "2023-01-08T04:00:18Z",
                "author": "BARKS",
                "urlToImage": "https://img.barks.jp/img/article/1000228627/H/1200.jpg",
                "description": "wacciが1月7日(土)に＜wacci Hall Tour 2022 ~Boost!~＞のファイナル公演を神奈川県民ホールにて開催した。本公演のチケットはSOLD OUTを果たし、MCでは3度目にして遂に会場を満...",
                "source": {
                    "name": "Barks.jp",
                    "id": null
                },
                "title": "wacci、＜wacci Hall Tour 2022 ~Boost!~＞ファイナル公演で新たなツアーの開催発表",
                "url": "https://www.barks.jp/news/?id=1000228627#utm_source=feed_news&utm_medium=feed&utm_campaign=feed",
                "content": "wacci17()wacci Hall Tour 2022 ~Boost!~SOLD OUTMC3wacci11suits me! suits you!suits you21\r\n52()Zepp Namba(OSAKA)wacci Live Tour 2023817()20:00wacciMC\r\nwacci Hall Tour 2022 ~Boost!~\r\n202317M1.M2.M3.M4.M\u2026 [+346 chars]"
            }
        ],
        "14131": [
            {
                "publishedAt": "2023-01-05T01:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「ダーマフィラーの世界市場 (2023年～2032年)：市場規模 (タイプ・材料・用途・エンドユーザー別)・地域別展望・成長の潜在性・価格動向・競合市場シェア・予測」（Global Mar...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーションダーマルフィラーによる口唇形成市場、2032年までCAGR11%で成長予測",
                "url": "https://japan.cnet.com/release/30817051/",
                "content": "2032\r\n20228AbbVieAllergan AestheticsJUVEDERM VOLUX XCFDA\r\n20232032CAGR11%\r\n203235%2032\r\n202235\r\nTEL044-952-01029:00-18:00 URL\r\n1995525010\r\n1995215-00041-2-37F\r\n202012244171"
            }
        ],
        "14384": [
            {
                "publishedAt": "2023-01-05T05:05:03Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "◆北里大学海洋生命科学部（神奈川県相模原市）の授業で、水中ドローンの映像をリアルタイムで配信し、江の島沖の深海環境を観察しました。◆観察時に出現したトリノアシを2個体採集し、同学部のミニ水族館「北里アクアリウムラボ」で展示を開始しました。◆新江ノ島水族館（神奈川県藤沢市）との学術交流協定に基づく連携...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "北里大学教室から深海生物調査！ミニ水族館で展示 -- 北里大学",
                "url": "https://japan.cnet.com/release/30817312/",
                "content": "2\r\n202211242ROV160m2\r\n11302202212\r\nURL\r\n252-0373 1-15-1TEL: 042-778-9132\r\n108-8641 5-9-1TEL: 03-5791-6422E-mail: kohoh@kitasato-u.ac.jp"
            },
            {
                "publishedAt": "2023-01-07T12:00:00Z",
                "author": "クランクイン！",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/2/e/2e4ab_203_e2117e42_f42b66d8.jpg",
                "description": "乃木坂46の1期生でキャプテンの秋元真夏が7日、オフィシャルブログにて、グループを卒業することを発表した。2月26日に神奈川県・横浜アリーナで「秋元真夏 卒業コンサート」を行い、これをもって卒業する。【写真】卒業続いた2022年「坂道グループ」13名の卒業メンバーを振り返る秋元が卒業を決めたのは2022年の初めの頃だという。加入からの11年間を通して、メンバー、スタッフ、ファンのことが大好きになったことを振り返り、「こんなにみんなのこと好きになっちゃったから 全文クランクイン！ 01月07日21時00分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "乃木坂46キャプテン・秋元真夏が卒業発表　2月26日の卒業コンサートをもって",
                "url": "https://news.livedoor.com/article/detail/23500340/",
                "content": "4617226 \r\n202213\r\n202211\r\n4622225446 11th YEAR BIRTHDAY LIVE226 \r\n1\r\n^^\r\n1846 1 19\r\n202246120111"
            },
            {
                "publishedAt": "2023-01-06T08:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「電子カルテ市場 - 世界の業界分析、規模、シェア、成長、動向、予測（2022年～2031年）」（Transparency Market Research）の販売を1月6日より開始いたしました。",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーション電子カルテの市場規模、2031年末までに503億米ドル以上に達する見込み",
                "url": "https://japan.cnet.com/release/30817591/",
                "content": "2021307US202220315.0CAGR2031503\r\nEHR\r\n202155\r\n2009HITECH\r\n2031Adoption of Electronic Health Record Systems among the U.S. Non-Federal Acute Care Hospitals75.5%\r\nAlmirallArchetype InnovationsAllscript\u2026 [+197 chars]"
            },
            {
                "publishedAt": "2023-01-08T00:00:09Z",
                "author": "news4vip2",
                "urlToImage": "https://livedoor.blogimg.jp/news4vip2/imgs/3/a/3a858d34-s.png",
                "description": "1: バリニーズ(神奈川県) [JP]  2023/01/06(金) 11:28:05.09 ID:QH614WiV0● BE:128776494-2BP(10500)  sssp://img.5ch.net/ico/nida.gif  詳細は>>2    https://news.yahoo.co.jp/flash  引用元：https://hayabusa9.5ch.net/test/read.cgi/news/1672972085/",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "【画像】ワンピースが22年に世界で最も視聴された番組に輝くｗｗｗｗｗ",
                "url": "http://news4vip.livedoor.biz/archives/52475559.html",
                "content": "1: () [JP] 2023/01/06() 11:28:05.09 ID:QH614WiV0 BE:128776494-2BP(10500)\r\nhttps://hayabusa9.5ch.net/test/read.cgi/news/1672972085/"
            }
        ],
        "14132": [
            {
                "publishedAt": "2023-01-06T07:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/24504/91/ogp/d24504-91-702705aaaa88e9ea3a86-2.png",
                "description": "[株式会社ナップス]\n[画像1: https://prtimes.jp/i/24504/91/resize/d24504-91-702705aaaa88e9ea3a86-2.png ]\n\n\n\n　オートバイ用品の小売・開発を行う株式会社ナップス（本社：神奈川県横浜市、代表取締役：望月 真裕）は、オートバ...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "ナップス 関西エリアに2店舗目「堺インター店」をオープン",
                "url": "https://prtimes.jp/main/html/rd/p/000000091.000024504.html",
                "content": "(31-15)2023232(6)10Naps +E\r\nFacebook\r\nhttps://www.naps-jp.com/web/shop/sakai/2302_opening/\r\nFacebookhttps://www.facebook.com/naps.sakai\r\n196231(6)90035,000(20231)30\u201cFor all Riders.\u201d \r\n \r\nNaps +ENaps \u2026 [+80 chars]"
            }
        ],
        "14341": [
            {
                "publishedAt": "2023-01-07T01:40:02Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/22446/115/ogp/d22446-115-393b70e3cf3d77620128-0.png",
                "description": "[アルビレックス新潟シンガポール]\n[画像: https://prtimes.jp/i/22446/115/resize/d22446-115-393b70e3cf3d77620128-0.png ]\n\n角田 薫平選手 Kumpei Kakuta\n\nポジション\nMF\n\n生年月日\n1999年5月8日 (23歳)\n\n出身地\n神奈川県\n\n身長 / 体重\n178cm / ...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "角田 薫平選手 福山シティFCへ完全移籍のお知らせ",
                "url": "https://prtimes.jp/main/html/rd/p/000000115.000022446.html",
                "content": "Kumpei Kakuta\r\nMF\r\n199958 (23)\r\n / \r\n178cm / 71kg\r\nFC → → → \r\nFC11\r\n<ol><li> &gt;<\/li><li> &gt;<\/li><li> FC<\/li><\/ol>"
            },
            {
                "publishedAt": "2023-01-06T12:42:58Z",
                "author": "4Gamer編集部",
                "urlToImage": "https://www.4gamer.net/games/051/G005106/20230106123/SS/001.jpg",
                "description": "FRONTIER ゲーマーズ   配信元 インバースネット 配信日 2023/01/05    【FRONTIER】NVIDIA GeForce RTX 4070 Ti搭載デスクトップパソコンの販売を開始 BTOパソコンの販売を行うインバースネット株式会社（本社：神奈川県横浜市神奈川区新浦島町1-1-25、代表取締役社長：山本 慶次郎）（以下、当社）は、2023年1月5日（木）23時より、グラフィックスカードNVIDIA GeForce RTX 4070 Tiを搭載したデスク\u2026",
                "source": {
                    "name": "4gamer.net",
                    "id": null
                },
                "title": "FRONTIER，GeForce RTX 4070 Ti搭載ゲーマー向けPC計6製品を発売",
                "url": "https://www.4gamer.net/games/051/G005106/20230106123/",
                "content": "FRONTIERNVIDIA GeForce RTX 4070 Ti\r\nBTO1-1-25 20231523NVIDIA GeForce RTX 4070 TiNVIDIAGPURTX 40GeForce RTX 4070 TiGeForce RTX 4070 TiFPSAIGAGHGBMSIMF6\r\nFRONTIERhttps://www.frontier-direct.jp/20231523\u2026 [+324 chars]"
            },
            {
                "publishedAt": "2023-01-05T03:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「前臨床CROの世界市場 (2023年～2032年)：市場規模 (サービス・エンドユーザー別)・地域別展望・COVID-19の影響・用途の潜在性・価格動向・競合市場シェア・予測」（Global Ma...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーション前臨床CROにおける政府・学術機関市場、2022年にシェア14.5%を獲得",
                "url": "https://japan.cnet.com/release/30817053/",
                "content": "CRO2032\r\nCRO\r\n20232032CAGR7%\r\n202214.5%CRO\r\n2032\r\nCRO\r\nCROLaboratory Corporation of AmericaCharles River LaboratoryPharmaceutical Product Development (PPD) LLCICON plcEurofins ScientificParexel Inter\u2026 [+141 chars]"
            }
        ],
        "14137": [
            {
                "publishedAt": "2023-01-08T01:45:00Z",
                "author": "朝日新聞デジタル",
                "urlToImage": "https://imgopt.asahi.com/ogp/AS20230107004126_comm.jpg",
                "description": "金融教育に関する実践報告コンクール（金融広報中央委主催、金融庁など後援）で、神奈川県横須賀市立夏島小の高岡政晴教諭（32）のリポートが優秀賞を受賞した。「小学生がお金を稼ぐ！？」をテーマに、手作り雑\u2026",
                "source": {
                    "name": "Asahi.com",
                    "id": null
                },
                "title": "ダンスが良かったら50円　お金を稼いで寄付、小学校の授業に優秀賞",
                "url": "https://www.asahi.com/articles/ASR177790QDVULOB00T.html",
                "content": "Copyright © The Asahi Shimbun Company. All rights reserved. No reproduction or republication without written permission."
            },
            {
                "publishedAt": "2023-01-05T22:06:46Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230106/K10013942471_2301060704_0106070647_01_02.jpg",
                "description": "5日夜、神奈川県松田町で住宅が全焼する火事があり、焼け跡から1人が遺体で見つかりました。火事のあとこの家に住む10歳の男の子と連絡が取れなくなっているということで、警察が身元の確認を進めています。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "神奈川 松田町 住宅全焼の火事 1人死亡 住人の10歳の男の子か",
                "url": "https://www3.nhk.or.jp/news/html/20230106/k10013942471000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-05T02:05:30Z",
                "author": "二木信",
                "urlToImage": "https://cdn.qetic.jp/wp-content/uploads/2023/01/03055810/interview230103-kusudama-1.jpg",
                "description": "音楽ライターの二木信が、この困難な時代（Hard Times）をたくましく、しなやかに生きる人物や友人たち（Good Friends）を紹介していく連載「good friends, hard times\r\n」。国内のヒップホップに軸足を置きながら執筆活動を展開してきた二木が、主にその世界やその周辺の音楽文化、はたまたそれ以外の世界で活躍、躍動、奔走するプレイヤー（ラッパー／ビートメイカー／DJ）、A&Rやプロデューサーなど様々な人物を通じて音楽のいまと、いまの時代をサヴァイヴするヒントを探ります。\r\n\n\n第7回目\u2026",
                "source": {
                    "name": "Qetic.jp",
                    "id": null
                },
                "title": "近所のキッチンに集まり、お皿を囲む。Hoodish Recordingsを紹介する──MaL、JAZZCUZZ、インタヴュー",
                "url": "https://qetic.jp/column/good-friends-hard-times/kusudama-hoodishrecordings/444243/",
                "content": "Hard TimesGood Friendsgood friends, hard times\r\nDJA&amp;R\r\n7KUSUDAMAHoodish RecordingsTHE KITCHENMaLJAZZCUZZ\r\nKUSUDAMAIRONSTONE \u2013 HYPER BURN feat. eyezen\r\n20212022Hoodish RecordingsHoodishHoodishKUSU\u2026 [+2280 chars]"
            },
            {
                "publishedAt": "2023-01-06T03:35:48Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/35946/4/ogp/d35946-4-4dfb268f71f7bf763082-2.jpg",
                "description": "[重ね煮アカデミー]\n日本初の料理コンテスト！重ね煮コンテスト２０２３開催決定のお知らせ\nもっともおいしい重ね煮はどれだ？\n　2023年1月6日\n日本重ね煮協会（神奈川県鎌倉市）は日本初の料理コンテスト「重ね煮コンテスト2023」を...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "日本初の料理コンテスト！重ね煮コンテスト２０２３開催決定のお知らせ",
                "url": "https://prtimes.jp/main/html/rd/p/000000004.000035946.html",
                "content": "20231620232023316\r\n2023202331620231201312139:0022118:0031611:0031612:00NANBUBASE1-1 \r\nSDGS\r\nSDGS\r\nWEB\r\n11\r\n120131\r\n213221\r\n2286,000\r\n2023\r\n316\r\n316\r\n213\r\n2023316\r\n20023®20002019202127,0006000\r\nhttps:\u2026 [+18 chars]"
            },
            {
                "publishedAt": "2023-01-04T20:49:30Z",
                "author": "booq",
                "urlToImage": "https://livedoor.blogimg.jp/booq/imgs/e/7/e76d98d0.jpg",
                "description": "1 ： 現場猫(神奈川県) ：2023/01/05(木) 03:50:32.82 ID:49vMaEsv0●「ドライバー不足で荷物の3割が届かない」人類史上\u201c最も便利すぎる社会\u201dが招いた「物流崩壊」の危機（省略）全文https://news.yahoo.co.jp/articles/1a6a0285190d1de81a57c65edc57f3ef0c2b17c0転載元ス...",
                "source": {
                    "name": "Matometanews.com",
                    "id": null
                },
                "title": "2030年、荷物の3割が届かなくなる　どうする日本？",
                "url": "http://matometanews.com/archives/2054292.html",
                "content": "HYDE175cmYOSHIKI156cm\r\n()\r\n2 () 2023/01/05() 03:51:51.93 ID:n7ga2miP0\r\n3 () 2023/01/05() 03:51:59.99 ID:M8DQp+6s020 () 2023/01/05() 03:56:16.34 ID:rB16EpZ10&gt;&gt;3\r\n4 () 2023/01/05() 03:52:10.93 ID\u2026 [+4566 chars]"
            }
        ],
        "14214": [
            {
                "publishedAt": "2023-01-08T04:48:18Z",
                "author": "フルカウント",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/4/9/490b3_1397_318fc512_8ba45070.jpg",
                "description": "三浦監督は新人合同自主トレ初日に登場、金言を授けたDeNAの新人合同自主トレが8日、神奈川県横須賀市の球団総合施設「DOCK OF BAYSTARS YOKOSUKA」でスタート。ドラフト1位の大阪桐蔭高・松尾汐恩捕手、同2位のトヨタ自動車・吉野光樹投手ら10選手（支配下5人、育成5人）全員が参加した。午前10時から始まり、午後1時には三浦大輔監督が姿を見せ訓示。「今の気持ちを忘れないでくれ！どういう気持ちでこの横須賀のグラウンドに来たか、どういう気持ちでユニホームに袖を通した 全文フルカウント 01月08日13\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "指示待ち族になるな！　DeNA三浦監督が新人に気合注入「自分で考えるのが一番大事」",
                "url": "https://news.livedoor.com/article/detail/23502236/",
                "content": "DeNA8DOCK OF BAYSTARS YOKOSUKA121055\r\n1011\r\n1\r\nOK25 / Hirohisa Miyawaki"
            },
            {
                "publishedAt": "2023-01-07T08:45:00Z",
                "author": "文春オンライン",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/0/5/05e74_1386_b9d04d255506190cd3acc134b6879a84.jpg",
                "description": "2022年12月13日の昼を過ぎた頃、海に近い閑静な住宅街に激震が走った。神奈川県平塚市の戸建てに住む会社経営の新谷哲男さん（76）と清子さん（75）夫婦と「連絡がつかない」と知人が交番に駆け込んだのだ。【画像】緑色に変わり果てた事件のあった家長男を含めた3人暮らしの新谷さん宅が、家庭内トラブルを抱えていることは地元では広く知られていた。警察もその例外ではなく、駆けつけた警察官の不安は的中し、鮮やかな緑色の戸建ての2階で変わり果てた姿の夫婦を発見したのだ。 全文文春オンライン 01月07日17時45分",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "《平塚・夫婦絞殺事件》両親の首を絞め、顔が炭になるまで焼いた\u2026猟奇的犯行に及んだ長男（50）が抱いていた「被害妄想」と「ブラジル愛」",
                "url": "https://news.livedoor.com/article/detail/23499235/",
                "content": "202212137675\r\n32\r\n2\r\nFacebook\r\n501414\r\n50\r\n40\r\n202110202296\r\n20211115\r\nSão PauloTokyo2022827\r\n40\r\n8\r\nSNS\r\nDM\r\nsbdigital@bunshun.co.jphttps://twitter.com/bunshunho2386\r\nWeb"
            }
        ],
        "14215": [
            {
                "publishedAt": "2023-01-06T06:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "2023年1月6日～2023年1月31日まで、マッチング確定で過去最高の1万ポイント付与キャンペーン。株式会社コンフィデンス（神奈川県横浜市、代表取締役 吉川 義行）が運営するエンタメマッチングアプリ『プリッチ』は、2023年1月9日の成人の日を記念して、成人式応援キャンペーンを実施いたします。アプリをご利用いただき...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社コンフィデンス【成人の日応援キャンペーン】安心安全エンタメマッチングアプリ『プリッチ』が18歳～20歳のキャストまたはゲストの出会いを応援します！",
                "url": "https://japan.cnet.com/release/30817679/",
                "content": "20231620231311\r\n2023191820125,00010,0001819\r\n[1: ]\r\n12\r\n3,000[2: ]\r\n[3: ]\r\n4 000148\r\n2436524\r\n10,00020231620231311820\r\n2431\r\n[: ]\r\n[4: ]\r\n2012\r\n()&amp;SNSFacebook,Instagram, LineTwitterInstagramSNS\r\n\u2026 [+12 chars]"
            },
            {
                "publishedAt": "2023-01-06T00:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「食品用ガスの世界市場：種類別 (窒素、酸素、二酸化炭素)・用途別 (冷凍・冷蔵、包装、炭酸化)・産業別 (乳製品・冷凍食品、食品・飲料、食肉・鶏肉・海産物)・地域別の将来...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーション食品用ガス市場、2027年に106億米ドル到達予測",
                "url": "https://japan.cnet.com/release/30817284/",
                "content": "202276CAGR6.9%2027106\r\nEUEC96/77/ECFDAFood and Drug AdministrationFDAGRASNo.1935/2004FDAFSMA2010FSMA201114\r\nCAGR7.5%\r\nPopulation Reference Bureau202044600020\r\nWesfarmers LimitedPT Aneka Gas Industri \u2026 [+80 chars]"
            },
            {
                "publishedAt": "2023-01-08T00:16:15Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230108/K10013944111_2301072128_0108091616_01_02.jpg",
                "description": "ベトナム戦争の従軍取材などを行い没後30年以上がたった今も広く読まれていている作家、開高健の作品や人生を振り返り、戦争などについて考えるイベントが神奈川県茅ヶ崎市で開かれました。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "開高健の作品振り返り戦争など考える催し 神奈川 茅ヶ崎",
                "url": "https://www3.nhk.or.jp/news/html/20230108/k10013944111000.html",
                "content": ""
            },
            {
                "publishedAt": "2023-01-06T01:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "～実際に自分がデザインしたチョコレートが当たるキャンペーンも～株式会社カヤック(本社：神奈川県鎌倉市 代表取締役 柳澤大輔)は、株式会社高島屋が開催するバレンタインイベントのプロモーションとして、エディブルフラワー（食べられるお花）のチョコレートを使ったWebコンテンツを企画・制作しました。 Webコンテン...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社カヤック【高島屋バレンタイン企画】\"エディブルフラワー\"とチョコレートで甘いメッセージをつくるWebコンテンツ 2023年1月6日（金）公開",
                "url": "https://japan.cnet.com/release/30817500/",
                "content": "( )Web WebWebInstagram10\r\n[1: ]\r\n46Web\r\n46\r\nDARKMILKWHITE3[2: ]\r\n14[3: ]\r\n[4: ]\r\n[5: ]\r\nSNS\r\n[6: ]\r\n10\r\nWebMAAHA10\r\n[: ]\r\nMAAHACHOCOLATE\r\nMpraesoMAAHACHOCOLATE\r\n993,845\r\n20231610→21110\r\nEDIBLE GARDEN\u2026 [+88 chars]"
            },
            {
                "publishedAt": "2023-01-05T04:00:35Z",
                "author": "ガジェット通信",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/9/3/93217_242_97c78337eda3d16f0ffc013baca8c563.jpg",
                "description": "地方創生移住支援事業の一つに移住支援金があります。これは東京23区に在住・通勤する人が、東京圏外（東京都、埼玉県、千葉県、神奈川県以外）に移住して起業や就業等を行う人に対し、各地方自治体が1世帯あたり最大100万円＋子供1人あたり30万円の支援金を給付する事業のことです。https://twitter.com/jijicom/status/1608073714255503366昨年の12月28日、日本政府は子供1人あたりの支援金を30万円から100万円に引き上げる方針を決定しました。これが海外で話題を呼んでいます\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "日本の移住支援金が海外で話題 「東京の人口密度は異常だから」「アメリカドルだと大した金額じゃねえな」",
                "url": "https://news.livedoor.com/article/detail/23486989/",
                "content": "231100130\r\nhttps://twitter.com/jijicom/status/1608073714255503366\r\n1228130100\r\nhttps://twitter.com/FoxNews/status/1610697602714025996\r\nhttps://twitter.com/CNBC/status/1610289889450377216\r\nhttps://twi\u2026 [+275 chars]"
            }
        ],
        "14135": [
            {
                "publishedAt": "2023-01-07T10:00:28Z",
                "author": "mdwww",
                "urlToImage": "https://livedoor.blogimg.jp/baikusokuho1/imgs/c/b/cbb4052c-s.jpg",
                "description": "7日朝早く、神奈川県相模原市で緊急走行中の救急車とバイクが衝突し、バイクに乗っていた男性が死亡しました。 7日午前5時すぎ、神奈川県相模原市中央区の県道で、交通事故の現場に向かって緊急走行していた救急車に乗っていた隊員から「赤信号を直進中に右から来たバ...",
                "source": {
                    "name": "Baiku-sokuho.info",
                    "id": null
                },
                "title": "緊急走行中の救急車に衝突したバイクの運転手が死亡",
                "url": "http://baiku-sokuho.info/archives/1080303942.html",
                "content": "5: 2023/01/07() 15:30:26.14 ID:yS8woCKA0\r\n8 \r\n89: 2023/01/07() 16:02:09.88 ID:khcP+cwy0\r\n105: 2023/01/07() 16:07:51.88 ID:+nK3kAhy0\r\n155: 2023/01/07() 16:20:12.70 ID:fhyqoJWA0\r\n206: 2023/01/07() 16:3\u2026 [+940 chars]"
            },
            {
                "publishedAt": "2023-01-06T03:40:02Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/102167/7/ogp/d102167-7-88e6336142765eee3884-0.png",
                "description": "[ULTRA SOCIAL株式会社]\nULTRA SOCIAL株式会社（本社：神奈川県横浜市、代表取締役社長：高橋亮太）が、2023年1月6日に、日本有数のトップライバー「ひのえんま」とTikTok LIVEにおける専属所属契約を締結しましたことをお知らせいたしま...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "日本トップライバー「ひのえんま」ULTRA SOCIALが運営するクリエイターエージェンシーCue\u2019sに所属契約締結",
                "url": "https://prtimes.jp/main/html/rd/p/000000007.000102167.html",
                "content": "ULTRA SOCIAL202316TikTok LIVETikTok\r\n@https://www.tiktok.com/@hinoenmaLIVELIVE2022No.1 LIVE1TikTok LIVE\r\n &lt;&gt;ULTRA SOCIALCue\u2019sTikTok LIVEULTRA SOCIALTikTokCue\u2019s\r\n  TikTok First LiveFirst TikTok \u2026 [+195 chars]"
            },
            {
                "publishedAt": "2023-01-06T04:28:00Z",
                "author": "nagazou",
                "urlToImage": "https://srad.jp/static/topics/news_64.png",
                "description": "東京都多摩地域の井戸水から発がん性が疑われる有機フッ素化合物（PFAS）が検出されているそうだ。これにより汚染によって取水停止が判断された井戸は11の浄水施設（7市）の34本に上ることが判明した。東京新聞によれば、汚染源は不明だが、過去に米軍横田基地内で、長年にわたり大量のPFASを含む泡消火剤が土壌に漏出したとする報道があったとされる。神奈川県や沖縄県内の米軍基地内や周辺でも同様にPFASの高濃度での検出が相次いでいるとしている（東京新聞）。 すべて読む | サイエンスセクション | 地球 | ニュース | 関\u2026",
                "source": {
                    "name": "Srad.jp",
                    "id": null
                },
                "title": "多摩地域の水道取水井戸でPFAS汚染が広がる",
                "url": "https://science.srad.jp/story/23/01/05/132202/",
                "content": "descriptive\r\ntypodupeerror\r\nTrademarks property of their respective owners. Comments owned by the poster. ©SRAD. SRAD is an Appirits service."
            }
        ],
        "14212": [
            {
                "publishedAt": "2023-01-06T01:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「5G NTNの世界市場：コンポーネント別 (ハードウェア、ソリューション、サービス)・エンドユース産業別 (海運、航空宇宙・防衛、政府、鉱業)・用途別 (eMBB、URLLC、mMTC)・地...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーション5G NTN市場、2027年に161億米ドル到達予測",
                "url": "https://japan.cnet.com/release/30817317/",
                "content": "5G NTN202232CAGR38.2%2027161BolidenEricssonEricsson5G5G NTN\r\nLEOCAGR\r\nLEO5G NTN2030LEO\r\nLEO5G NTN20197TelesatTelesatLEO620228MediaTekRohde &amp; SchwarzLEONodeBgNB5G NTN5G NTN5G\r\neMBB\r\n5G NTN500Kmph1\u2026 [+128 chars]"
            },
            {
                "publishedAt": "2023-01-05T04:46:40Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "＝調達した資金で更なる国内外の販路拡大と、充填設備の拡充＝株式会社Agnavi（代表取締役：玄成秀、本社：神奈川県茅ケ崎市）は、三菱UFJキャピタル株式会社（代表取締役社長：坂本 信介、本社：東京都中央区）を引受先とするS種優先株式の新株発行による第三者割当増資により、シードラウンドで総額約3千万円の資金調...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社Agnavi【資金調達】日本酒缶ブランド「ICHI-GO-CAN(R)（一合缶(R)）」展開のAgnavi、三菱UFJキャピタルよりシードラウンドで3千万円を調達。",
                "url": "https://japan.cnet.com/release/30817307/",
                "content": "AgnaviUFJ S3VCCVC\r\n[1: ]\r\n\u201c\u201d180LICHI-GO-CAN(R)CANPAI70\r\nUFJUFJ234 7F1974\r\nURL\r\n[2: ]\r\nEnglish\r\nStart-up Finance Agnavi Inc., a Japanese start-up company promoting its original SAKE brand, ICHI-GO-CAN\u2026 [+2857 chars]"
            },
            {
                "publishedAt": "2023-01-06T00:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「オーディオブックの世界市場規模、シェア＆産業動向分析レポート：好みのデバイス別、ターゲットオーディエンス（大人・子供）別、流通チャネル別、ジャンル別（フィクション...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーションオーディオブック市場、2028年に197億米ドル規模に達する見込み",
                "url": "https://japan.cnet.com/release/30817264/",
                "content": "2028197202826.0%CAGR\r\nCOVID-19\r\nCOVID-19COVID-19\r\n2WazeAudiblePandoraSpotify\r\n95CD\r\nMalcolm GladwellMichael Lewis\r\nTEL044-952-01029:00-18:00 URL\r\n1995520015\r\n1995215-00041-2-37F\r\n202012244171"
            },
            {
                "publishedAt": "2023-01-05T01:40:09Z",
                "author": null,
                "urlToImage": "https://thebridge.jp/wp-content/themes/thebridge2019/assets/images/placeholder.svg",
                "description": "テープス株式会社（本社：神奈川県茅ヶ崎市、代表取締役：田渕健悟）は、プレシリーズ A ラウンドにて、小売・流通を DX・SX するスタートアップを対象とする VC ファンドの運用を行う New Commerce Ventures 株式会社 （本社：東京都品川区、代表：松山馨太・大久保洸平）が運営する、コマース領域特化型 VC ファンド「New Commerce Explosion 投資事業有限責任...\nThe post テープス株式会社、New Commerce Ventures より資金調達を実施し、EC 特\u2026",
                "source": {
                    "name": "Thebridge.jp",
                    "id": null
                },
                "title": "テープス株式会社、New Commerce Ventures より資金調達を実施し、EC 特化ノーコードツール「TēPs」の事業開発体制を強化",
                "url": "https://thebridge.jp/prtimes/467961",
                "content": "(C) THE BRIDGE, Inc. All Rights Reserved."
            }
        ],
        "14136": [
            {
                "publishedAt": "2023-01-05T00:19:48Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "１月13日東京オートサロンアップガレージブース内にて開催決定！中古カー＆バイク用品の買取・販売専門店「アップガレージ」を運営する株式会社アップガレージ（本社:神奈川県横浜市、代表取締役社長:河野映彦）は、2023年1月13日に開催される東京オートサロンにて、「JAPAN CAR AWARDS2022\u20102023」（https://www.japanca...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社アップガレージ「JAPAN CAR AWARDS2022\u20102023」授賞式開催のお知らせ",
                "url": "https://japan.cnet.com/release/30817138/",
                "content": "13\r\n::2023113JAPAN CAR AWARDS20222023\r\nJAPAN CAR AWARDS\u201d\u201d2014\r\nTwitterInstagram\r\n114595\r\n1\r\nSDGs× \r\n100[1: ]\r\n20231131500\r\nJAPAN CAR AWARDS11316[2: ]\r\n7-22199942\r\n&amp;ww.nexus-japan.co.jp/\r\nPR TIMES"
            }
        ],
        "14213": [
            {
                "publishedAt": "2023-01-07T06:34:08Z",
                "author": "cardmics",
                "urlToImage": "https://cdn-ak.f.st-hatena.com/images/fotolife/c/cardmics/20180505/20180505154616.jpg",
                "description": "クレジットカード会社は常に不正利用がないかどうかを監視している証拠がTwitter上にあった\u2026という雑談ネタ。クレジットカードは不正利用が怖いと思っている方は、こういった不正利用を防ぐための取り組みについて知ってもらえればと思います。",
                "source": {
                    "name": "Cardmics.com",
                    "id": null
                },
                "title": "カード会社は常に不正利用がないかどうかを監視している\u2026という証拠がTwitterで拡散されている！クレジットカードの監視体制について。",
                "url": "https://news.cardmics.com/entry/card-fusei-kanshitaisei/",
                "content": "今回はクレジットカードの監視体制をあらわす面白いツイートがあったのでそれを紹介。\nこの方はクレジットカードを不正利用されそうになったものの、カード会社による機転の効く判断により、被害を未然に防いでもらった\u2026という話みたいです。\n\nクレカ不正利用されたっぽいんですが今までAmazondownloadで漫画ばっかり買ってた引きこもりのキモオタがアウトドアグッズを大量購入したことをクレカ会社が不審に思\u2026 [+2377 chars]"
            },
            {
                "publishedAt": "2023-01-06T09:54:35Z",
                "author": null,
                "urlToImage": "https://www3.nhk.or.jp/news/html/20230106/K10013943321_2301061851_0106185404_01_02.jpg",
                "description": "先月、神奈川県茅ヶ崎市の住宅で男性を殺害したとして逮捕された50歳の容疑者について、横浜地方検察庁は刑事責任能力を調べるための精神鑑定を行うことになりました。",
                "source": {
                    "name": "Nhk.or.jp",
                    "id": null
                },
                "title": "神奈川 茅ヶ崎 男性刺殺事件 容疑者を鑑定留置 横浜地検",
                "url": "https://www3.nhk.or.jp/news/html/20230106/k10013943321000.html",
                "content": ""
            }
        ],
        "14218": [
            {
                "publishedAt": "2023-01-05T10:02:00Z",
                "author": "超ワールドサッカー",
                "urlToImage": "https://image.news.livedoor.com/newsimage/stf/4/b/4b4e2_1494_48ba2aff_5fbab55e.jpg",
                "description": "徳島ヴォルティスは5日、FW佐藤晃大(36)が現役を引退することを発表した。なお、引退後はクラブのフロントスタッフとして営業推進部で入社することとなる。佐藤は神奈川県出身で、東海大学から2009i年に徳島ヴォルティスへと入団。3シーズンを過ごすと、2012年にガンバ大阪へと完全移籍する。G大阪で3シーズンを過ごし、J1通算49試合13得点、J2通算5試合1得点、リーグカップ通算10試合2得点、天皇杯通算6試合3得点、AFCチャンピオンズリーグ(ACL)通算5試合に出場を果たした。2015年に 全文超ワールドサッカ\u2026",
                "source": {
                    "name": "Livedoor.com",
                    "id": null
                },
                "title": "徳島のFW佐藤晃大が36歳で現役引退、G大阪でもプレー",
                "url": "https://news.livedoor.com/article/detail/23489239/",
                "content": "5FW(36)\r\n2009i32012\r\nG3J14913J25110263AFC(ACL)5\r\n2015\r\nJ15J220027851"
            },
            {
                "publishedAt": "2023-01-04T22:00:19Z",
                "author": "honwaka2ch",
                "urlToImage": "https://livedoor.blogimg.jp/honwaka2ch/imgs/0/0/006cc2e3-s.jpg",
                "description": "3 名前：ソマリ(神奈川県) [ﾆﾀﾞ][] 投稿日：2023/01/04(水) 17:34:30.71 ID:AVvvhF/N0ホウボウ22 名前：マーブルキャット(埼玉県) [US][] 投稿日：2023/01/04(水) 17:37:02.44 ID:IVuj5tci0 [1/3]>>3同じくホウボウ新潟で食べてめちゃくちゃ美味かった35 名前：カラカル(愛知...",
                "source": {
                    "name": "Livedoor.biz",
                    "id": null
                },
                "title": "初めて食った魚で「ほう、こりゃうめぇわ」と関心した魚",
                "url": "http://honwaka2ch.livedoor.biz/archives/10207190.html",
                "content": "3 () [][] 2023/01/04() 17:34:30.71 ID:AVvvhF/N022 () [US][] 2023/01/04() 17:37:02.44 ID:IVuj5tci0 [1/3]&gt;&gt;3\r\n35 () [US][sage] 2023/01/04() 17:38:56.70 ID:K+AVGSVn0&gt;&gt;3\r\n96 () [VE][] 2023/01\u2026 [+1482 chars]"
            },
            {
                "publishedAt": "2023-01-08T01:00:00Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/60406/255/ogp/d60406-255-329cf34709ba3edc35fa-0.png",
                "description": "[香川ファイブアローズ]\nチームマネージャー\n大山 陽　MINAMI OYAMA\n\n[画像: https://prtimes.jp/i/60406/255/resize/d60406-255-329cf34709ba3edc35fa-0.png ]\n\n■プロフィール\n生年月日：1999年8月5日\n出身地：神奈川県\n出身校：駒澤大...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "【香川ファイブアローズ】2022-23シーズン チームマネージャー契約締結（新規）のお知らせ",
                "url": "https://prtimes.jp/main/html/rd/p/000000255.000060406.html",
                "content": "MINAMI OYAMA\r\n1999852022-23 2023- \r\n<ol><li> &gt;<\/li><li> &gt;<\/li><li>2022-23 <\/li><\/ol>\r\nURL\r\nhttps://www.fivearrows.jp/news/detail/id=16054"
            },
            {
                "publishedAt": "2023-01-06T06:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "~LINE向けMAツールとHubSpotの連携によるリード獲得から商談までの活用戦略~企業のマーケティング、DX化などの支援を行う株式会社H＆K（本社：神奈川県横浜市、支店：東京都新宿区、代表取締役CEO：安藤弘樹）が、2023年1月31日（火）に、株式会社コンシェルジュ様と共催で「LINE×HubSpotを使った最先端の1to1マーケティ...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "H&K【1月31日(火)】H&K×株式会社コンシェルジュの共催ウェビナー「LINE×HubSpotを使った最先端の1to1マーケティング」を開催（無料）",
                "url": "https://japan.cnet.com/release/30817680/",
                "content": "~LINEMAHubSpot~\r\nDXHKCEO2023131LINE×HubSpot1to1\r\n[: ]\r\n20231311314ZOOMLINE×HubSpot1to1\r\nLINE\r\n1to1KUZENHubSpot\r\n20231311314Zoom\r\nH&amp;K\r\n1300-13101310-13301to11330-1350KUZENHubSpot1350-100\r\nWEB20213\u2026 [+103 chars]"
            }
        ],
        "14216": [
            {
                "publishedAt": "2023-01-06T01:25:36Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "～TikTok LIVEでの配信を強化～ULTRA SOCIAL株式会社（本社：神奈川県横浜市、代表取締役社長：高橋亮太）が、2023年1月6日に、日本有数のトップライバー「ひのえんま」とTikTok LIVEにおける専属所属契約を締結しましたことをお知らせいたします。それに伴い、TikTokのアカウントを開設いたします。[画像: https://prti...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "ULTRA SOCIAL株式会社日本トップライバー「ひのえんま」ULTRA SOCIALが運営するクリエイターエージェンシーCue\u2019sに所属契約締結",
                "url": "https://japan.cnet.com/release/30817520/",
                "content": "TikTok LIVE\r\nULTRA SOCIAL202316TikTok LIVETikTok\r\n[: ]\r\n@\r\nLIVELIVE2022No.1 LIVE1TikTok LIVE\r\n&lt;&gt;ULTRA SOCIALCue\u2019sTikTok LIVEULTRA SOCIALTikTokCue\u2019s\r\nTikTok First LiveFirst TikTok LIVE17()20\r\nUL\u2026 [+110 chars]"
            },
            {
                "publishedAt": "2023-01-05T06:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "デロイト トーマツ グループ（東京都千代田区、グループCEO：木村研一、以下、デロイト トーマツ）は、2023年1月5日付でINFINITY FORCE ソリューションズ株式会社（神奈川県横浜市、代表取締役：⼯藤直⼈、以下、IF Sol）から、ビジネスプロセスマネジメント（BPM）コンサルティングとSAP導入コンサルティング事業を譲り...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "デロイト トーマツ グループデロイト トーマツ、INFINITY FORCE ソリューションズからBPMコンサルティング事業を譲受",
                "url": "https://japan.cnet.com/release/30817335/",
                "content": "CEO 202315INFINITY FORCE IF SolBPMSAP DTRAIF SolBPMSAP\r\nBPMPDCAIF SolDXBPMSAP\r\nDXEnd-to-EndM&amp;AIF Sol\r\nDTRABPMBPMSAPDTRA\r\nINFINITY FORCE 201811 151-1-7BPMSAP"
            }
        ],
        "14217": [
            {
                "publishedAt": "2023-01-05T02:40:02Z",
                "author": null,
                "urlToImage": "https://prtimes.jp/i/53134/226/ogp/d53134-226-4c4190437a780ef28bf2-0.png",
                "description": "[株式会社ライトライト]\n\n今回の後継者募集について\n事業承継マッチングプラットフォーム「relay（リレイ）」について\n会社概要\n\n1.今回の後継者募集について\n\n[画像1: https://prtimes.jp/i/53134/226/resize/d53134-226-4c4190437a780e...",
                "source": {
                    "name": "Prtimes.jp",
                    "id": null
                },
                "title": "神奈川県小田原市の寿司屋「千両寿司」が「事業承継マッチングプラットフォームrelay（リレイ）」で後継者を募集。",
                "url": "https://prtimes.jp/main/html/rd/p/000000226.000053134.html",
                "content": "<ol><li><\/li><li>relay<\/li><li><\/li><\/ol>1.\r\n131955 19491988200501\r\nURLhttps://relay.town/entrustments/senryo_zushi\r\n<ul><li><\/li><li>0120-417-007<\/li><li> info@light-right.jp<\/li><\/ul>2.relay\r\nrelay\u2026 [+92 chars]"
            },
            {
                "publishedAt": "2023-01-06T02:00:00Z",
                "author": null,
                "urlToImage": "https://japan.cnet.com/media/c/2012/images/logo/logo_ogp.png",
                "description": "株式会社グローバルインフォメーション（所在地：神奈川県川崎市、代表者：小野悟、証券コード：東証スタンダード 4171）は、市場調査レポート「電池製造機の世界市場：機械の種類別 (混合機、コーティング・乾燥機、カレンダー機、スリッター機、電極積層機、組立・ハンドリング機、形成・試験機)・電池の種類別 (NMC、...",
                "source": {
                    "name": "CNET",
                    "id": null
                },
                "title": "株式会社グローバルインフォメーション電池製造機の市場規模、2027年に194億米ドル到達予測",
                "url": "https://japan.cnet.com/release/30817318/",
                "content": "202273CAGR21.52027194EVEV\r\n2027\r\n1SEI\r\nCAGR\r\ne-\"Battery 2030+\"\r\nTEL044-952-01029:00-18:00 URL\r\n1995520015\r\n1995215-00041-2-37F\r\n202012244171"
            },
            {
                "publishedAt": "2023-01-06T12:59:23Z",
                "author": null,
                "urlToImage": "https://blogimg.goo.ne.jp/user_image/00/20/7cabf0d9bcc77f475e29854a026818e8.jpg",
                "description": "これからもぜひ一日一回、上下ともクリックしてくださると大変うれしいです！！！\n\nにほんブログ村\n社会・経済ニュースランキング\n\nAmazon　社会・政治・法律\nAｍazon　Kindle　ベストセラー\n \n \n　ＴＢＳやＮＨＫによりますと、２０２３年１月６日に厚生労働省が発表した新型コロナウイルスによる全国の死者数は４５６人で、去年１２月２９日の４２０人を上回って、一日の発表としては、これまでで最も多くなりました。\n　もっとも、読売新聞によると昨日５日、新型コロナウイルスの者は４９８人で、昨年１２月２７日の４３８\u2026",
                "source": {
                    "name": "Goo.ne.jp",
                    "id": null
                },
                "title": "１月６日に厚生労働省が発表した新型コロナウイルスによる全国の死者数は４５６人で過去最多。死者数の波のピークが来るのはまだ１月中旬から下旬。コロナ棄民政策の岸田内閣は総辞職せよ。",
                "url": "https://blog.goo.ne.jp/raymiyatake/e/fcad493828cf7049d98a63aeca3f9551",
                "content": "6\r\n3004437724554240677292720260193815957202903211773189159515928164656311429141798014859132486957813089741221012520245713723873847168779480466148794212554402524255101420764796743960472547571746980949\u2026 [+315 chars]"
            }
        ]
    }
}

function getFirstDayOfMonth(){
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-01';
}

const first_day_of_month = getFirstDayOfMonth();

const session_token = uuidv4();

let lng = 139.6806874;
let lat = 35.697656;

const search_uri = 'https://api.mapbox.com/search/v1/';

const common_params = `language=ja&country=jp&access_token=${mapboxgl.accessToken}`;

const geocoding_uri = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const directions_uri = 'https://api.mapbox.com/directions/v5/mapbox/';

const news_uri = `https://newsapi.org/v2/everything?sortBy=publishedAt&apiKey=a0ff4ff42f2c47589463b18bdbbfea58&from=${first_day_of_month}&q=`;

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function createPostObj() {
    const postObj = {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return postObj;
}

const directionBounds = [
    [-123.069003, 45.395273],
    [-122.303707, 45.612333]
];

randomPointInPoly = function (polygon) {
    var bounds = polygon.getBounds();
    var x_min = bounds.getEast();
    var x_max = bounds.getWest();
    var y_min = bounds.getSouth();
    var y_max = bounds.getNorth();

    var lat = y_min + (Math.random() * (y_max - y_min));
    var lng = x_min + (Math.random() * (x_max - x_min));

    var point = turf.point([lng, lat]);
    var poly = polygon.toGeoJSON();
    var inside = turf.inside(point, poly);

    if (inside) {
        return point
    } else {
        return randomPointInPoly(polygon)
    }
}

async function fetchDataJson(file) {
    const query = await fetch(`./data/${file}`, { method: 'GET' });
    return await query.json();
}

async function fetchJson(file) {
    const query = await fetch(file, { method: 'GET' });
    return await query.json();
}

async function fetchReverseGeo(coordinates) {
    const query = await fetch(`${geocoding_uri}${coordinates[0]},${coordinates[1]}.json?${common_params}`, { method: 'GET' });
    return await query.json();
}

function getPolygonArray(ward) {
    let wardPolyList = [];
    if (ward.geometry.type === 'Polygon') {
        wardPolyList.push(ward.geometry.coordinates[0]);
    } else if (ward.geometry.type === 'MultiPolygon') {
        for (const poly of ward.geometry.coordinates) {
            wardPolyList.push(poly[0]);
        }
    }
    return wardPolyList;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getImage() {
    const random = getRandomInt(3);
    if (random === 0) {
        return 'sunshine';
    } else if (random === 1) {
        return 'thunder';
    } else {
        return 'blue_skies';
    }
}

function getVideo() {
    const random = getRandomInt(3);
    if (random === 0) {
        return 'sunny';
    } else if (random === 1) {
        return 'sunset';
    } else {
        return 'thunder';
    }
}

function randomPointsInTokyo() {
    const count = 2;
    let randomPointsList = [];
    let wardPolyList = [];

    //let promiseList = [];

    let fc = { 'type': 'FeatureCollection', 'features': [] };
    fetchDataJson('tokyo-by-ward.geojson').then(json => {
        //promiseList.push(json)
        for (const ward of json.features) {
            wardPolyList = getPolygonArray(ward);
            wardRandomPointsList = [];
            /*if (ward.geometry.type === 'Polygon') {
                wardPolyList.push(ward.geometry.coordinates[0]);
            } else if (ward.geometry.type === 'MultiPolygon') {
                for (const poly of ward.geometry.coordinates) {
                    wardPolyList.push(poly[0]);
                }

            }*/
            let i = 0;
            let index = 0;
            while (i < count) {
                const polygon = L.polygon(wardPolyList[index]);
                randomPoint = randomPointInPoly(polygon);
                randomPointsList.push(randomPoint);
                i++;
                index++;
                if (index >= wardPolyList.length) {
                    index = 0;
                }
                const orig = randomPoint.geometry.coordinates;
                randomPoint.geometry.coordinates = [orig[1], orig[0]];

                fc.features.push(randomPoint);

                /*fetchReverseGeo(randomPoint.geometry.coordinates).then(geo => {
                    promiseList.push(geo);
                    for (const f of geo.features) {
                        if (f.place_type === 'address') {
                            randomPoint.address = f.text;
                            break;
                        }
                    }
                    //console.log(geo.features[0])
                    //randomPoint.properties = geo.features[0].properties;

                    //promiseList.push(geo);
                });*/
            }
        }


        //console.log(fc)

        const listings = document.getElementById('asideList');
        const listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';

        const link = listing.appendChild(document.createElement('a'));
        link.href = makeTextFile(JSON.stringify(fc));
        console.log(link.href)
        link.className = 'title';
        link.innerHTML = `GetFILE`;



    });
}

var textFile = null,
    makeTextFile = function (text) {
        var data = new Blob([text], { type: 'text/plain' });

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        // returns a URL you can use as a href
        return textFile;
    };

