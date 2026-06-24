import React, { useState, useEffect } from 'react';
import { Globe, Cpu, Map, Target, Award, ArrowRight, CheckCircle2, XCircle, Lightbulb, MapPin } from 'lucide-react';

// --- 音效系統 ---
const playSound = (type) => {
  const audioUrls = {
    correct: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3', // 答對的叮咚聲
    wrong: 'https://assets.mixkit.co/active_storage/sfx/946/946-preview.mp3', // 答錯的提示聲
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // 一般按鈕點擊
    pop: 'https://assets.mixkit.co/active_storage/sfx/1114/1114-preview.mp3', // 地圖放置的啵啵聲
    win: 'https://assets.mixkit.co/active_storage/sfx/2015/2015-preview.mp3' // 破關的歡呼音效
  };
  
  if (audioUrls[type]) {
    const audio = new Audio(audioUrls[type]);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('音效播放被瀏覽器阻擋:', e));
  }
};

// --- 多國語言 UI 字典 ---
const UI_TEXT = {
  zh: {
    appTitle: "記憶體的跨國製程",
    appSubtitle: "跟著晶片環遊世界",
    introP1: "打開大家平常使用的平板、電腦或是手機的外殼，裡面會有一塊塊黑色的方形小零件，這就是『晶片』。晶片是電子產品運作的核心，沒有它，設備就無法開機與執行指令。",
    introP2: "在各種晶片中，有一種叫做『記憶體』，主要功能是『儲存資料』。確保我們拍的照片、遊戲進度在關機後也不會消失。",
    introP3: "不過，要製造出一顆記憶體晶片非常複雜！它必須透過跨國合作，藉由不同國家的專屬優勢來分工。擅長研發的發明技術、擅長製造的生產、人力充足的負責包裝。接下來，讓我們跟著晶片一起環遊世界吧！",
    startBtn: "開始挑戰",
    m1Title: "任務一：尋找生產基地",
    m1Rule1: "這關的第一個任務！畫面上會出現各個國家的產業線索卡。",
    m1Rule2: "請仔細閱讀上面的資訊，推測這座工廠位在哪一個國家，並點擊下方對應的按鈕。",
    m1Rule3: "主動查看【提示一】或是第一次猜錯，都是完全不會扣分的喔！但如果猜錯兩次，系統就會開啟額外的【提示二（生活線索）】，這時候才會影響最後的過關星等！",
    startGuessBtn: "開始推測",
    m1Header: "任務一：國家推測",
    progress: "進度",
    guessQuestion: "請根據線索，找出這是哪個國家？",
    factoryTaskTitle: "廠區任務",
    hint1Title: "提示一",
    hint2Title: "提示二",
    clickHint1: "點擊查看【提示一】",
    correctNextBtn: "答對了！前往下一題",
    finishM1Btn: "完成任務！前往第二關",
    m2Title: "任務二：全球佈局",
    m2Rule1: "太棒了！你已經成功辨識出所有國家的特徵。現在我們要進行第二階段的任務。",
    m2Rule2: "請看眼前的這張世界地圖，地圖上有幾個被標示出來的節點，這些就是美光在全球設立據點的地方。",
    m2Rule3: "任務目標：請先在下方點選「國家標籤」，然後點擊地圖上發著紫光的據點，將這",
    m2Rule4: "個國家準確地放置到對應的地理位置上！",
    openMapBtn: "開啟世界地圖",
    m2Header: "任務二：在地圖上建立工廠",
    m2SubheadWaiting: "先點選下方標籤，再點選地圖上的紫色據點",
    m2SubheadVerifying: "正在驗證廠區座標...",
    wrongPlacement: "❌ 蓋錯囉",
    shouldBe: "應為:",
    waitingTags: "待放置的國家標籤",
    submitBtn: "確認繳交，查看結果！",
    retryBtn: "修改完成，再次繳交！",
    m1Score: "任務一星等",
    m2Score: "任務二星等",
    successTitle: "闖關成功！",
    outroP1: "看看這張世界地圖，上面標示的",
    outroP2: "個國家，就是一顆記憶體晶片從無到有、最後送到我們手上的完整路線。",
    outroP3: "像美光這樣的跨國公司在決定要把工廠蓋在哪裡時，絕對不是隨便挑選的。每一個據點都是依據各國的『專屬優勢』來決定。",
    outroSummary: "這就是美光高效率的秘密！\n研發在美國，\n製造在台灣、日本和新加坡，\n最後送到馬來西亞、中國與印度包裝出貨。",
    outroP4: "一顆小小的晶片，背後是結合了全世界最厲害的強項，才打造出的全球供應鏈！",
    playAgainBtn: "重新遊玩"
  },
  ja: {
    appTitle: "マイクロン キャンプ チャレンジ",
    appSubtitle: "メモリのグローバル製造：チップと世界一周",
    introP1: "私たちが普段使っているタブレットやスマホを開けると、中に黒い四角い小さな部品があります。これが「チップ（半導体）」です。チップは電子機器の心臓部で、これがないと電源も入りません。",
    introP2: "様々なチップの中で、「メモリ」と呼ばれるものは「データを保存する」機能を持っています。写真やゲームのデータが、電源を切っても消えないのはメモリのおかげです。",
    introP3: "しかし、メモリチップを作るのは非常に複雑で、複数の国が協力し、それぞれの国の「得意なこと」を活かして分業しています。開発が得意な国、製造が得意な国、パッケージングが得意な国。さあ、チップと一緒に世界を旅しましょう！",
    startBtn: "チャレンジ開始",
    m1Title: "ミッション1：生産拠点を探せ",
    m1Rule1: "最初のミッションです！画面に各国の「産業ヒントカード」が表示されます。",
    m1Rule2: "情報をよく読んで、その工場がどの国にあるかを推測し、下のボタンをクリックしてください。",
    m1Rule3: "自分から【ヒント1】を見たり、1回間違えたりしても減点されません！でも、2回間違えると【ヒント2（生活のヒント）】が開き、クリア時の星の数に影響します！",
    startGuessBtn: "推測を始める",
    m1Header: "ミッション1：国を推測",
    progress: "進捗",
    guessQuestion: "ヒントから、どの国か当ててみよう！",
    factoryTaskTitle: "工場の役割",
    hint1Title: "ヒント1",
    hint2Title: "ヒント2",
    clickHint1: "クリックして【ヒント1】を見る",
    correctNextBtn: "正解！次の問題へ",
    finishM1Btn: "ミッション完了！次へ進む",
    m2Title: "ミッション2：グローバル展開",
    m2Rule1: "素晴らしい！すべての国の特徴を見分けられましたね。次は第2段階のミッションです。",
    m2Rule2: "目の前の世界地図を見てください。マークされている場所が、マイクロンが世界に設けている拠点です。",
    m2Rule3: "ミッション目標：下の「国のタグ」を選んでから、地図上の紫色に光るポイントをクリックし、これら",
    m2Rule4: "つの国を正確な位置に配置してください！",
    openMapBtn: "世界地図を開く",
    m2Header: "ミッション2：地図に工場を建てる",
    m2SubheadWaiting: "下のタグを選んでから、地図の紫の拠点をクリック",
    m2SubheadVerifying: "拠点の位置を検証中...",
    wrongPlacement: "❌ 違います",
    shouldBe: "正解:",
    waitingTags: "配置待ちのタグ",
    submitBtn: "提出して結果を見る！",
    retryBtn: "修正完了、もう一度提出！",
    m1Score: "ミッション1の星",
    m2Score: "ミッション2の星",
    successTitle: "クリアおめでとう！",
    outroP1: "この世界地図を見てください。マークされた",
    outroP2: "つの国が、メモリチップが作られて私たちの手に届くまでの完全なルートです。",
    outroP3: "マイクロンようなグローバル企業は、工場を適当に建てるわけではありません。すべての拠点は各国の「独自の強み」に基づいて決められています。",
    outroSummary: "これがマイクロンの高効率の秘密！\n研究開発はアメリカ、\n製造は台湾、日本、シンガポール、\n最後にマレーシア、中国、インドでパッケージング・出荷されます。",
    outroP4: "小さなチップの裏には、世界中の最高の強みを組み合わせたグローバルサプライチェーンがあるのです！",
    playAgainBtn: "もう一度遊ぶ"
  }
};

// --- 資料定義 (支援雙語) ---
const COUNTRIES = [
  {
    id: 'usa',
    name: { zh: '美國', ja: 'アメリカ' },
    flagUrl: 'https://flagcdn.com/w80/us.png',
    factoryType: { zh: '研發總部', ja: '研究開発本部' },
    factoryDesc: { 
      zh: '美光全球最主要的辦公室。裡面有一群科學家和工程師，專門負責發明最新、最進步的記憶體技術。', 
      ja: 'マイクロン最大のグローバルオフィス。科学者やエンジニアが最新のメモリ技術を発明しています。' 
    },
    hint1: { 
      zh: '美光誕生的地方，有著頂尖的大學，能吸引各國厲害的科學家來發明最新技術。', 
      ja: 'マイクロンが誕生した場所。トップレベルの大学があり、世界中から優秀な科学者が集まります。' 
    },
    hint2: { 
      zh: '多汁漢堡與熱狗，炸雞香氣四溢；巨無霸牛排鋪滿起司，甜甜圈帶來極致甜蜜。', 
      ja: 'ジューシーなハンバーガーやホットドッグ。巨大なステーキや甘いドーナツが有名です。' 
    },
    mapPos: { x: 23, y: 34 }
  },
  {
    id: 'japan',
    name: { zh: '日本', ja: '日本' },
    flagUrl: 'https://flagcdn.com/w80/jp.png',
    factoryType: { zh: 'DRAM 晶圓製造廠', ja: 'DRAM ウェハー製造工場' },
    factoryDesc: { 
      zh: '負責大量生產一種叫做「DRAM」的晶片。這種晶片處理資料的速度非常快，可以讓電腦或手機運作得更順暢。', 
      ja: '処理速度が非常に速く、パソコンやスマホをスムーズに動かす「DRAM」チップを大量生産します。' 
    },
    hint1: { 
      zh: '這裡的人極度嚴謹，把化學材料與精密機器做到極度精準，幫助美光製造出更精密的晶片。', 
      ja: '非常に厳格で、化学材料や精密機器を正確に扱い、より精密なチップの製造をサポートします。' 
    },
    hint2: { 
      zh: '由許多島嶼組成的國家，境內有許多高山，地震發生頻繁。', 
      ja: '多くの島からなる国。高い山があり、地震がよく発生します。' 
    },
    mapPos: { x: 86, y: 32 }
  },
  {
    id: 'taiwan',
    name: { zh: '台灣', ja: '台湾' },
    flagUrl: 'https://flagcdn.com/w80/tw.png',
    factoryType: { zh: 'DRAM 晶圓製造廠', ja: 'DRAM ウェハー製造工場' },
    factoryDesc: { 
      zh: '負責大量生產一種叫做「DRAM」的晶片。這種晶片處理資料的速度非常快，可以讓電腦或手機運作得更順暢。', 
      ja: '処理速度が非常に速く、パソコンやスマホをスムーズに動かす「DRAM」チップを大量生産します。' 
    },
    hint1: { 
      zh: '靠著周邊工廠互相幫忙，把設計、製造到包裝全集中在一起，生產快又能馬上修改。', 
      ja: '周辺の工場が協力し合い、設計からパッケージングまで集中しており、素早く生産・修正ができます。' 
    },
    hint2: { 
      zh: '好吃的夜市小吃聞名，經常有地震和颱風。', 
      ja: '美味しい夜市の屋台グルメで有名。地震や台風がよくあります。' 
    },
    mapPos: { x: 82.5, y: 43 }
  },
  {
    id: 'singapore',
    name: { zh: '新加坡', ja: 'シンガポール' },
    flagUrl: 'https://flagcdn.com/w80/sg.png',
    factoryType: { zh: 'NAND 晶圓製造廠', ja: 'NAND ウェハー製造工場' },
    factoryDesc: { 
      zh: '負責大量生產一種叫做「NAND」的晶片。這種晶片的功能是長期保存資料，可以把照片、影片或遊戲檔案好好地存起來。', 
      ja: 'データを長期保存し、写真や動画、ゲームのデータをしっかり保存する「NAND」チップを大量生産します。' 
    },
    hint1: { 
      zh: '國際海運和空運的中心，憑藉中立外交政策成為「避風港」，晶片送到世界各地很方便。', 
      ja: '国際的な海運・空運の中心地。中立的な外交政策で「安全な港」となり、世界中への出荷に便利です。' 
    },
    hint2: { 
      zh: '東南亞的國家，面積不大，經濟卻很繁榮。', 
      ja: '東南アジアの国。面積は小さいですが、経済は非常に繁栄しています。' 
    },
    mapPos: { x: 78.5, y: 55 }
  },
  {
    id: 'china',
    name: { zh: '中國', ja: '中国' },
    flagUrl: 'https://flagcdn.com/w80/cn.png',
    factoryType: { zh: '封裝測試廠', ja: 'パッケージング・テスト工場' },
    factoryDesc: { 
      zh: '負責把前面做好的大塊晶圓，精準地切成一顆顆小晶片，並幫它們裝上保護外殼。最後還要經過嚴格的檢查，確定每一顆晶片都能正常運作，才會出貨賣給客人。', 
      ja: 'ウェハーを正確に切り分け、保護ケースに入れます。最後に厳しい検査を行い、正常に動作することを確認して出荷します。' 
    },
    hint1: { 
      zh: '有非常多製造手機、電腦、電動車的工廠，晶片包裝測試好後，可以直接賣給需要的工廠。', 
      ja: 'スマホやパソコン、電気自動車の工場がたくさんあり、パッケージング後にすぐ必要な工場へ販売できます。' 
    },
    hint2: { 
      zh: '超過 14 億人口。保留知名的古代建築，有用來防禦敵人的「萬里長城」、過去古代皇帝居住的「故宮」。', 
      ja: '人口14億人以上。「万里の長城」や昔の皇帝が住んでいた「故宮」など、有名な古代建築が残っています。' 
    },
    mapPos: { x: 76, y: 35 }
  },
  {
    id: 'malaysia',
    name: { zh: '馬來西亞', ja: 'マレーシア' },
    flagUrl: 'https://flagcdn.com/w80/my.png',
    factoryType: { zh: '封裝測試廠', ja: 'パッケージング・テスト工場' },
    factoryDesc: { 
      zh: '負責把前面做好的大塊晶圓，精準地切成一顆顆小晶片，並幫它們裝上保護外殼。最後還要經過嚴格的檢查，確定每一顆晶片都能正常運作，才會出貨賣給客人。', 
      ja: 'ウェハーを正確に切り分け、保護ケースに入れます。最後に厳しい検査を行い、正常に動作することを確認して出荷します。' 
    },
    hint1: { 
      zh: '在新加坡隔壁。很早就發展電子包裝技術，靠著經驗豐富的人才，專門為晶片做好出貨前最後的保護與檢查。', 
      ja: 'シンガポールの隣。早くから電子パッケージング技術を発展させ、経験豊富な人材が最後の保護と検査を行います。' 
    },
    hint2: { 
      zh: '在這裡的工廠會遇見工程師，早上用英文和美國總部報告；下午用中文跟台灣工廠解決技術問題；下班前用馬來文處理當地的行政事務。', 
      ja: '朝は英語で米国本社に報告、午後は中国語で台湾工場と連携、夕方はマレー語で地元の事務を処理する多言語エンジニアがいます。' 
    },
    mapPos: { x: 77.5, y: 52 }
  },
  {
    id: 'india',
    name: { zh: '印度', ja: 'インド' },
    flagUrl: 'https://flagcdn.com/w80/in.png',
    factoryType: { zh: '封裝測試廠', ja: 'パッケージング・テスト工場' },
    factoryDesc: { 
      zh: '負責把前面做好的大塊晶圓，精準地切成一顆顆小晶片，並幫它們裝上保護外殼。最後還要經過嚴格的檢查，確定每一顆晶片都能正常運作，才會出貨賣給客人。', 
      ja: 'ウェハーを正確に切り分け、保護ケースに入れます。最後に厳しい検査を行い、正常に動作することを確認して出荷します。' 
    },
    hint1: { 
      zh: '擁有大量擅長數學與軟體工程的頂尖人才，近年開始建立全新的大型工廠。', 
      ja: '数学やソフトウェアエンジニアリングが得意なトップレベルの人材が豊富で、近年新しい大型工場を建設し始めました。' 
    },
    hint2: { 
      zh: '目前人口最多國家，有一條被視為神聖的「恆河」。', 
      ja: '現在人口が最も多い国。神聖とされる「ガンジス川」があります。' 
    },
    mapPos: { x: 71, y: 45 }
  }
];

export default function App() {
  const [lang, setLang] = useState('zh'); // 'zh' or 'ja'
  const t = UI_TEXT[lang]; // 當前語言的字典

  const [stage, setStage] = useState('intro'); // intro, m1_intro, m1_play, m2_intro, m2_play, outro
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  // Mission 1 States
  const [m1Questions, setM1Questions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showHint1, setShowHint1] = useState(false);
  const [showLifeHint, setShowLifeHint] = useState(false);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [wrongAnswersForCurrentQ, setWrongAnswersForCurrentQ] = useState([]);
  const [isCurrentQCorrect, setIsCurrentQCorrect] = useState(false);

  // Mission 2 States
  const [mapPlacements, setMapPlacements] = useState({});
  const [selectedTag, setSelectedTag] = useState(null);
  const [m2Feedback, setM2Feedback] = useState(false);
  const [verifiedPlacements, setVerifiedPlacements] = useState([]);
  const [m2Attempts, setM2Attempts] = useState(0);

  // 初始化遊戲
  useEffect(() => {
    const shuffled = [...COUNTRIES].sort(() => Math.random() - 0.5);
    setM1Questions(shuffled);
  }, []);

  const calculateM1Score = (hints) => {
    if (hints <= 1) return 5;
    if (hints === 2) return 4;
    if (hints === 3) return 3;
    if (hints === 4) return 2;
    return 1; 
  };

  const calculateM2Score = (correctCount) => {
    if (correctCount >= 6) return 5;
    if (correctCount >= 4) return 4;
    if (correctCount >= 2) return 3;
    if (correctCount === 1) return 2;
    return 1;
  };

  const handleM1Select = (countryId) => {
    if (isCurrentQCorrect) return;

    const currentQ = m1Questions[currentQIndex];
    if (countryId === currentQ.id) {
      playSound('correct'); // 播放答對音效
      setIsCurrentQCorrect(true);
      setShowHint1(true);
      setShowLifeHint(true);
    } else {
      if (!wrongAnswersForCurrentQ.includes(countryId)) {
        playSound('wrong'); // 播放錯誤音效
        const updatedWrongAnswers = [...wrongAnswersForCurrentQ, countryId];
        setWrongAnswersForCurrentQ(updatedWrongAnswers);
        
        if (updatedWrongAnswers.length === 1) {
          if (!showHint1) setShowHint1(true);
        } 
        else if (updatedWrongAnswers.length === 2) {
          if (!showLifeHint) {
            setShowLifeHint(true);
            setTotalHintsUsed(prev => prev + 1);
          }
        }
      }
    }
  };

  const handleM1Next = () => {
    playSound('click'); // 播放點擊音效
    if (currentQIndex < m1Questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setShowHint1(false);
      setShowLifeHint(false);
      setWrongAnswersForCurrentQ([]);
      setIsCurrentQCorrect(false);
    } else {
      setScore1(calculateM1Score(totalHintsUsed));
      setStage('m2_intro');
    }
  };

  const handleTagSelect = (countryId) => {
    playSound('click'); // 選擇標籤音效
    setSelectedTag(countryId);
  };

  const handleMapClick = (targetSlotId) => {
    if (m2Feedback) return; 
    if (verifiedPlacements.includes(targetSlotId)) return; 

    if (selectedTag) {
      playSound('pop'); // 放置到地圖的啵啵音效
      setMapPlacements(prev => ({
        ...prev,
        [targetSlotId]: selectedTag
      }));
      setSelectedTag(null);
    } else if (mapPlacements[targetSlotId]) {
      playSound('click'); // 取消放置的音效
      const newPlacements = { ...mapPlacements };
      delete newPlacements[targetSlotId];
      setMapPlacements(newPlacements);
    }
  };

  const submitMission2 = () => {
    let correctCount = 0;
    let hasErrors = false;
    const currentVerified = [];

    Object.keys(mapPlacements).forEach(slotId => {
      if (slotId === mapPlacements[slotId]) {
        correctCount++;
        currentVerified.push(slotId); 
      } else {
        hasErrors = true; 
      }
    });

    if (m2Attempts === 0) {
      setScore2(calculateM2Score(correctCount));
    }
    
    setM2Attempts(prev => prev + 1);
    setM2Feedback(true); 

    if (!hasErrors) {
      playSound('win'); // 播放過關歡呼音效
      setTimeout(() => {
        setStage('outro');
      }, 2000);
    } else {
      playSound('wrong'); // 播放錯誤音效
      setTimeout(() => {
        setM2Feedback(false);
        setVerifiedPlacements(currentVerified); 
        
        const correctedPlacements = {};
        currentVerified.forEach(id => {
          correctedPlacements[id] = mapPlacements[id];
        });
        setMapPlacements(correctedPlacements); 
      }, 2500);
    }
  };

  const changeLanguage = (newLang) => {
    playSound('click');
    setLang(newLang);
  };

  // --- 語系切換器元件 (簡化版) ---
  const LangSwitcher = () => (
    <div className="absolute top-4 right-4 sm:right-8 z-50 flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-100">
      <button 
        onClick={() => changeLanguage('zh')} 
        className={`w-12 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${lang === 'zh' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        中
      </button>
      <button 
        onClick={() => changeLanguage('ja')} 
        className={`w-12 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${lang === 'ja' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        日
      </button>
    </div>
  );

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in text-center relative">
      <LangSwitcher />
      <div className="bg-blue-900 p-6 rounded-full mb-6 mt-8 sm:mt-0">
        <Cpu size={64} className="text-blue-200" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4 tracking-wider">{t.appTitle}</h1>
      <h2 className="text-xl sm:text-2xl text-blue-600 mb-8 font-semibold">{t.appSubtitle}</h2>
      
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 sm:p-8 max-w-2xl shadow-xl text-left leading-relaxed text-gray-700 text-lg">
        <p className="mb-4">{t.introP1}</p>
        <p className="mb-4">{t.introP2}</p>
        <p>{t.introP3}</p>
      </div>

      <button 
        onClick={() => { playSound('click'); setStage('m1_intro'); }}
        className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
      >
        {t.startBtn} <ArrowRight />
      </button>
    </div>
  );

  const renderM1Intro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in text-center relative">
      <LangSwitcher />
      <div className="bg-yellow-100 p-6 rounded-full mb-6 mt-8 sm:mt-0 text-yellow-600 shadow-inner">
        <Target size={64} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.m1Title}</h2>
      
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl shadow-xl text-left leading-relaxed text-gray-700 text-lg border-l-8 border-yellow-400">
        <p className="mb-4">{t.m1Rule1}</p>
        <p className="mb-4">{t.m1Rule2}</p>
        <p className="text-red-600 font-semibold bg-red-50 p-4 rounded-lg">
          💡 {t.m1Rule3}
        </p>
      </div>

      <button 
        onClick={() => { playSound('click'); setStage('m1_play'); }}
        className="mt-8 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-white rounded-full font-bold text-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
      >
        {t.startGuessBtn} <ArrowRight />
      </button>
    </div>
  );

  const renderM1Play = () => {
    if (m1Questions.length === 0) return null;
    const currentQ = m1Questions[currentQIndex];

    return (
      <div className="flex flex-col items-center min-h-screen p-6 w-full max-w-4xl mx-auto animate-fade-in relative pt-16 sm:pt-6">
        <LangSwitcher />
        <div className="w-full flex justify-between items-center mb-8 bg-white/50 p-4 rounded-xl">
          <span className="text-blue-800 font-bold text-lg sm:text-xl">{t.m1Header}</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-sm sm:text-base">
            {t.progress}：{currentQIndex + 1} / {m1Questions.length}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <MapPin className="text-blue-500 flex-shrink-0" /> {t.guessQuestion}
          </h3>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-5 sm:p-6 rounded-2xl border border-blue-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-bold">{t.factoryTaskTitle}</span>
                <span className="text-lg sm:text-xl font-bold text-blue-900">【{currentQ.factoryType[lang]}】</span>
              </div>
              <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed mb-5 pb-5 border-b border-blue-200">
                {currentQ.factoryDesc[lang]}
              </p>
              
              {!showHint1 ? (
                <button
                  onClick={() => { playSound('click'); setShowHint1(true); }}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-sm sm:text-base"
                >
                  <Lightbulb size={20} className="text-yellow-500" /> {t.clickHint1}
                </button>
              ) : (
                <div className="animate-fade-in">
                  <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-bold mb-3">{t.hint1Title}</span>
                  <p className="text-lg sm:text-xl text-gray-800 font-bold leading-relaxed">{currentQ.hint1[lang]}</p>
                </div>
              )}
            </div>

            {showLifeHint && (
              <div className="bg-yellow-50 p-5 sm:p-6 rounded-2xl border border-yellow-100 shadow-sm animate-slide-up">
                <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-bold mb-3 flex items-center gap-2 w-max">
                  <Lightbulb size={16}/> {t.hint2Title}
                </span>
                <p className="text-lg sm:text-xl text-gray-800 font-bold leading-relaxed">{currentQ.hint2[lang]}</p>
              </div>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {COUNTRIES.map((country) => {
              const isWrong = wrongAnswersForCurrentQ.includes(country.id);
              const isCorrect = isCurrentQCorrect && country.id === currentQ.id; 
              const isDisabled = isWrong || (isCurrentQCorrect && !isCorrect); 

              return (
                <button
                  key={country.id}
                  disabled={isDisabled}
                  onClick={() => handleM1Select(country.id)}
                  className={`p-3 sm:p-4 rounded-xl text-base sm:text-lg font-bold transition-all border-2 flex items-center justify-center gap-2
                    ${isCorrect 
                      ? 'bg-green-500 text-white border-green-500 scale-105 shadow-lg' 
                      : isDisabled 
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                        : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-500 hover:shadow-md active:scale-95'
                    }
                  `}
                >
                  <img src={country.flagUrl} alt={country.name[lang]} className="w-6 sm:w-8 h-auto rounded-[2px] shadow-sm" />
                  <span>{country.name[lang]}</span>
                  {isWrong && <XCircle className="inline text-red-400 flex-shrink-0" size={18}/>}
                  {isCorrect && <CheckCircle2 className="inline text-white flex-shrink-0" size={20}/>}
                </button>
              )
            })}
          </div>

          {isCurrentQCorrect && (
            <div className="w-full flex justify-center mt-8 animate-fade-in">
              <button
                onClick={handleM1Next}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg sm:text-xl shadow-lg flex items-center gap-2 transform hover:-translate-y-1 transition-all"
              >
                {currentQIndex < m1Questions.length - 1 ? t.correctNextBtn : t.finishM1Btn} <ArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderM2Intro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in text-center relative">
      <LangSwitcher />
      <div className="bg-green-100 p-6 rounded-full mb-6 mt-8 sm:mt-0 text-green-600 shadow-inner">
        <Map size={64} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.m2Title}</h2>
      
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl shadow-xl text-left leading-relaxed text-gray-700 text-lg border-l-8 border-green-400">
        <p className="mb-4">{t.m2Rule1}</p>
        <p className="mb-4">{t.m2Rule2}</p>
        <p className="text-green-700 font-semibold bg-green-50 p-4 rounded-lg">
          🎯 {t.m2Rule3}<strong className="text-purple-600 border-b-2 border-purple-400 px-1">{COUNTRIES.length}</strong>{t.m2Rule4}
        </p>
      </div>

      <button 
        onClick={() => { playSound('click'); setStage('m2_play'); }}
        className="mt-8 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
      >
        {t.openMapBtn} <ArrowRight />
      </button>
    </div>
  );

  const renderM2Play = () => {
    const isAllPlaced = COUNTRIES.every(c => Object.values(mapPlacements).includes(c.id));

    return (
      <div className="flex flex-col min-h-screen p-4 sm:p-6 w-full max-w-6xl mx-auto animate-fade-in relative pt-16 sm:pt-6">
         <LangSwitcher />
         <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 bg-white/50 p-4 rounded-xl">
          <span className="text-green-800 font-bold text-lg sm:text-xl">{t.m2Header}</span>
          <span className="text-sm font-bold text-gray-600">
            {m2Feedback ? t.m2SubheadVerifying : t.m2SubheadWaiting}
          </span>
        </div>

        <div className="relative w-full max-w-5xl mx-auto rounded-3xl border-4 border-white shadow-xl bg-blue-50/50 mb-6 overflow-hidden">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
            alt="World Map"
            className="w-full h-auto opacity-40 grayscale drop-shadow-sm pointer-events-none select-none block"
          />
          
          <div className="absolute inset-0 z-10">
            {COUNTRIES.map(country => {
              const placedCountryId = mapPlacements[country.id];
              const placedCountry = COUNTRIES.find(c => c.id === placedCountryId);
              const isVerified = verifiedPlacements.includes(country.id); 

              return (
                <div 
                  key={country.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${country.mapPos.x}%`, top: `${country.mapPos.y}%` }}
                >
                  {!placedCountry && (
                    <div className="absolute top-0 left-0 w-full h-full bg-purple-500 rounded-full animate-ping opacity-40 z-10 pointer-events-none"></div>
                  )}

                  <button
                    onClick={() => handleMapClick(country.id)}
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 flex items-center justify-center transition-all shadow-lg z-20 relative
                      ${placedCountry 
                        ? 'bg-white border-purple-500' 
                        : selectedTag 
                          ? 'bg-purple-50 border-dashed border-purple-600 hover:bg-purple-100 hover:scale-110 animate-pulse' 
                          : 'bg-purple-100 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]' 
                      }
                      ${(isVerified || (m2Feedback && placedCountryId === country.id)) ? '!bg-green-100 !border-green-500' : ''}
                      ${(m2Feedback && placedCountryId && placedCountryId !== country.id) ? '!bg-red-100 !border-red-500' : ''}
                    `}
                  >
                    {placedCountry ? <img src={placedCountry.flagUrl} alt={placedCountry.name[lang]} className="w-5 sm:w-7 h-auto rounded-[2px] shadow-sm" /> : <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedTag ? "text-purple-700" : "text-purple-600"}`} />}
                  </button>
                  
                  {placedCountry && (
                    <div className="absolute top-10 sm:top-14 whitespace-nowrap bg-white px-2 sm:px-3 py-1 rounded shadow-md text-xs sm:text-sm font-bold text-gray-800 z-30 flex items-center justify-center">
                      {placedCountry.name[lang]}
                    </div>
                  )}

                  {m2Feedback && placedCountryId && placedCountryId !== country.id && (
                     <div className="absolute -top-8 sm:-top-10 whitespace-nowrap bg-red-100 px-2 sm:px-3 py-1 rounded-full shadow-md text-[10px] sm:text-xs font-bold text-red-600 z-30 border border-red-300 animate-bounce">
                     {t.wrongPlacement}
                   </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg z-20">
          <h4 className="text-center font-bold text-gray-700 mb-4">{t.waitingTags}</h4>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {COUNTRIES.map(country => {
              const isPlaced = Object.values(mapPlacements).includes(country.id);
              const isSelected = selectedTag === country.id;
              
              if (isPlaced) return null; 

              return (
                <button
                  key={country.id}
                  onClick={() => handleTagSelect(country.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold transition-all border-2 flex items-center gap-2 text-sm sm:text-base
                    ${isSelected 
                      ? 'bg-blue-600 text-white border-blue-600 scale-105 sm:scale-110 shadow-lg' 
                      : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
                    }
                  `}
                >
                  <img src={country.flagUrl} alt={country.name[lang]} className="w-5 sm:w-6 h-auto rounded-[2px] shadow-sm" /> <span>{country.name[lang]}</span>
                </button>
              )
            })}
            
            {isAllPlaced && !m2Feedback && (
              <div className="w-full flex justify-center mt-4 animate-fade-in">
                <button 
                  onClick={submitMission2}
                  className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  {m2Attempts === 0 ? t.submitBtn : t.retryBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOutro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in text-center relative">
      <LangSwitcher />
      <div className="flex gap-4 mb-8 mt-8 sm:mt-0">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col items-center min-w-[130px] sm:min-w-[150px]">
          <span className="text-gray-500 text-xs sm:text-sm font-bold mb-2">{t.m1Score}</span>
          <div className="text-3xl sm:text-4xl font-black text-yellow-500 flex gap-1 items-center">
            {score1} <Award size={28} className="sm:w-8 sm:h-8" />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col items-center min-w-[130px] sm:min-w-[150px]">
          <span className="text-gray-500 text-xs sm:text-sm font-bold mb-2">{t.m2Score}</span>
          <div className="text-3xl sm:text-4xl font-black text-green-500 flex gap-1 items-center">
            {score2} <Award size={28} className="sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">{t.successTitle}</h2>
      
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-3xl shadow-xl text-left leading-relaxed text-gray-700 text-base sm:text-lg border-t-8 border-blue-500">
        <p className="mb-4">
          {t.outroP1} <strong className="text-blue-600 px-1">{COUNTRIES.length}</strong> {t.outroP2}
        </p>
        <p className="mb-4">
          {t.outroP3}
        </p>
        <div className="bg-blue-50 p-4 sm:p-6 rounded-xl mb-4 text-lg sm:text-xl font-bold text-blue-900 text-center leading-relaxed whitespace-pre-line">
          {t.outroSummary}
        </div>
        <p className="font-bold text-center text-blue-700 text-lg sm:text-xl mt-6">
          {t.outroP4}
        </p>
      </div>

      <button 
        onClick={() => { playSound('click'); window.location.reload(); }}
        className="mt-8 px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition-all"
      >
        {t.playAgainBtn}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}} />
      
      {stage === 'intro' && renderIntro()}
      {stage === 'm1_intro' && renderM1Intro()}
      {stage === 'm1_play' && renderM1Play()}
      {stage === 'm2_intro' && renderM2Intro()}
      {stage === 'm2_play' && renderM2Play()}
      {stage === 'outro' && renderOutro()}
    </div>
  );
}