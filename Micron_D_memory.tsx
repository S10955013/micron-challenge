import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Database, CheckCircle, XCircle, Clock, Trophy, Play, ChevronRight, AlertCircle, Globe } from 'lucide-react';

// --- 多國語言 UI 字典 ---
const t = {
  zh: {
    title: 'DRAM 還是 NAND Flash 要工作？',
    subtitle: '科技的長期與短期記憶',
    intro: '你們有沒有想過，為什麼電腦關機後，遊戲的進度卻還在？為什麼玩遊戲時手機需要夠強的記憶體，跑起來才不會卡？這其實是因為電腦擁有兩種不同屬性的「記憶方式」：',
    dramTitle: 'DRAM (短期記憶)',
    dramDesc: '負責暫存目前執行中的程式與資料，讀寫速度極快，但需要持續通電維持資料，斷電後資料即清空。',
    nandTitle: 'NAND Flash (長期記憶)',
    nandDesc: '負責長期儲存檔案、作業系統與應用程式，資料寫入後不需通電即可永久保存。',
    startBtn: '進入挑戰',
    demoTag: '示範練習',
    qProgress: (curr, total) => `第 ${curr} / ${total} 題`,
    scoreStr: '得分:',
    ansIs: '答案是',
    wrongDemo: '再想一想，請重新選擇',
    wrongReal: '正確答案是',
    timeoutStr: '動作太慢囉，答案是',
    retryBtn: '重新作答',
    nextBtn: '下一題',
    resultPerfect: '完美！記憶大師！',
    resultGood: '非常厲害！',
    resultDone: '闖關完成！',
    correctCount: '答對題數',
    congratsGot: '恭喜獲得',
    stickersUnit: '張過關貼紙',
    conclusionTitle: '結語：科技大腦與圖書館',
    conclusionP1: 'DRAM 的高速暫存與 NAND Flash 的長期儲存特性，就是現代數位世界運作的基石。無論是玩遊戲時的順暢體驗，還是儲存每一份重要檔案的安全性，背後都仰賴這兩種記憶體。',
    conclusionP2: '這正是美光(Micron)每天致力於突破的領域。美光是全球半導體產業的領導者，不僅研發更高速的 DRAM 讓設備瞬間處理複雜 AI 運算，同時也開發容量更大、壽命更長的 NAND Flash 技術。希望這場挑戰讓你們看見了晶片運作的奧秘，未來有機會，歡迎你們一起加入這場科技進化的行列！',
    returnBtn: '返回首頁',
    startText: 'START!'
  },
  ja: {
    title: 'DRAMとNAND Flash、どちらが働く？',
    subtitle: 'テクノロジーの長期記憶と短期記憶',
    intro: 'パソコンの電源を切ってもゲームの進行状況が残っている理由や、ゲーム中にスマホが高性能なメモリを必要とする理由を考えたことはありますか？実は、コンピュータには2つの異なる性質の「記憶方式」があるからです：',
    dramTitle: 'DRAM (短期記憶)',
    dramDesc: '現在実行中のプログラムやデータを一時的に保存します。読み書きの速度は非常に速いですが、データを維持するには継続的な電力供給が必要で、電源が切れるとデータは消去されます。',
    nandTitle: 'NAND Flash (長期記憶)',
    nandDesc: 'ファイル、OS、アプリケーションの長期保存を担当します。データが書き込まれた後は、電力がなくても永久に保存できます。',
    startBtn: 'チャレンジ開始',
    demoTag: 'デモ練習',
    qProgress: (curr, total) => `第 ${curr} / ${total} 問`,
    scoreStr: 'スコア:',
    ansIs: '答えは',
    wrongDemo: 'もう一度考えて、選び直してください',
    wrongReal: '正解は',
    timeoutStr: '時間切れです、答えは',
    retryBtn: 'やり直す',
    nextBtn: '次の問題',
    resultPerfect: 'パーフェクト！記憶マスター！',
    resultGood: 'とてもすごい！',
    resultDone: 'クリア！',
    correctCount: '正答数',
    congratsGot: '獲得おめでとうございます',
    stickersUnit: '枚のクリアステッカー',
    conclusionTitle: '結び：テクノロジーの脳と図書館',
    conclusionP1: 'DRAMの高速一時保存とNAND Flashの長期保存特性は、現代のデジタル世界が機能するための基盤です。ゲームをスムーズに楽しむ体験も、すべての重要なファイルを安全に保存することも、これら2つのメモリに依存しています。',
    conclusionP2: 'これこそがマイクロン(Micron)が日々突破を目指している分野です。マイクロンは世界の半導体産業のリーダーであり、デバイスが複雑なAI演算を瞬時に処理できるようにする高速なDRAMを開発するだけでなく、より大容量で長寿命のNAND Flash技術も開発しています。このチャレンジを通じて、チップが機能する秘密を理解していただけたなら幸いです。将来、この技術進化の隊列に皆さんが加わってくれることを歓迎します！',
    returnBtn: 'ホームに戻る',
    startText: 'START!'
  }
};

// --- 資料設定 (包含多國語言) ---
const demoQuestions = [
  {
    id: 'D1',
    text: {
      zh: '你正在搜尋引擎上查資料，當你點開一個網站時，網頁內容會迅速載入到你的螢幕上。在這一瞬間，網站的文字、圖片與版面資訊，為了讓瀏覽器能快速顯示給你閱讀，被載入了手機的哪個記憶體晶片中？',
      ja: '検索エンジンで情報を調べている時、ウェブサイトを開くと、ページの内容が瞬時に画面に読み込まれます。この瞬間、ブラウザが素早く表示できるように、サイトのテキスト、画像、レイアウト情報はスマホのどのメモリチップに読み込まれるでしょうか？'
    },
    answer: 'DRAM',
    hint: {
      zh: '網頁瞬間載入，需要極快的讀取速度與暫存空間。',
      ja: 'ページの瞬間的な読み込みには、極めて速い読み取り速度と一時保存スペースが必要です。'
    }
  },
  {
    id: 'D2',
    text: {
      zh: '你在瀏覽器查到了一篇非常重要的數位文章，為了怕以後忘記，你將這篇文章存成『PDF 檔案』保存在手機的資料夾中。即使你關機、拔掉手機電池，這份 PDF 檔案依然穩穩地存在你的手機裡。請問這個檔案是被存放在哪一個晶片中？',
      ja: 'ブラウザで非常に重要なデジタル記事を見つけ、後で忘れないように『PDFファイル』としてスマホのフォルダに保存しました。電源を切っても、バッテリーを外しても、このPDFファイルはスマホの中にしっかり残っています。このファイルはどのチップに保存されているでしょうか？'
    },
    answer: 'NAND',
    hint: {
      zh: '斷電後檔案依舊存在，屬於長期儲存。',
      ja: '電源を切ってもファイルが存在し続ける、長期保存に属します。'
    }
  }
];

const gameQuestions = [
  {
    id: 'Q01',
    text: {
      zh: '你昨晚熬夜寫好的英文報告，存成 PDF 檔放在桌面上。就算你把電腦徹底關機、拔掉插頭去睡覺，隔天打開電腦時檔案還在。請問這個 PDF 檔主要存放在哪裡？',
      ja: '昨晩徹夜で書いた英語のレポートをPDFファイルとしてデスクトップに保存しました。パソコンの電源を完全に切り、プラグを抜いて寝ても、翌日パソコンを開くとファイルはまだあります。このPDFファイルは主にどこに保存されているでしょうか？'
    },
    answer: 'NAND',
    hint: {
      zh: '斷電不消失，長期儲存',
      ja: '電源を切っても消えない、長期保存'
    }
  },
  {
    id: 'Q02',
    text: {
      zh: '你在玩賽車遊戲時，螢幕顯示目前的時速、圈數以及你的名次。請問這些「隨著遊戲進行而不斷變動的即時資訊」，是由哪一個晶片負責暫存的？',
      ja: 'レーシングゲームをしている時、画面には現在の時速、周回数、順位が表示されます。これらの「ゲームの進行に伴い絶えず変動するリアルタイム情報」は、どのチップが一時保存を担当しているでしょうか？'
    },
    answer: 'DRAM',
    hint: {
      zh: '遊戲進行中的即時變動資料',
      ja: 'ゲーム進行中のリアルタイム変動データ'
    }
  },
  {
    id: 'Q03',
    text: {
      zh: '你下載了最新的《超級馬力歐》遊戲安裝檔，存放在電腦裡，這需要佔用很大的硬碟空間。請問這個「完整的遊戲程式檔案」是存放在哪裡？',
      ja: '最新の「スーパーマリオ」のゲームインストールファイルをダウンロードしてパソコンに保存しました。これには大きなハードディスク容量が必要です。この「完全なゲームプログラムファイル」はどこに保存されているでしょうか？'
    },
    answer: 'NAND',
    hint: {
      zh: '安裝檔長期放置處',
      ja: 'インストールファイルの長期保存場所'
    }
  },
  {
    id: 'Q04',
    text: {
      zh: '你在手機裡拍了一張很棒的班級大合照，照片檔案已經自動儲存到你的手機相簿裡。這張照片目前安安穩穩地存放在哪裡？',
      ja: 'スマホでクラスの素晴らしい集合写真を撮り、写真ファイルは自動的にスマホのアルバムに保存されました。この写真は現在どこに安全に保存されているでしょうか？'
    },
    answer: 'NAND',
    hint: {
      zh: '珍貴回憶，長期儲存',
      ja: '大切な思い出、長期保存'
    }
  },
  {
    id: 'Q05',
    text: {
      zh: '你正在線上討論中，麥克風收音並即時傳送聲音訊號的緩衝處理過程。',
      ja: 'オンラインディスカッション中で、マイクが音を拾い、音声信号をリアルタイムで送信する際のバッファ処理過程。'
    },
    answer: 'DRAM',
    hint: {
      zh: '當下正在處理的串流資料',
      ja: '現在処理中のストリーミングデータ'
    }
  },
  {
    id: 'Q06',
    text: {
      zh: '平板安裝了英文字典APP，佔用了設備內 5GB 的儲存容量。',
      ja: 'タブレットに英語辞書アプリをインストールし、デバイス内の5GBのストレージ容量を占有しました。'
    },
    answer: 'NAND',
    hint: {
      zh: '應用程式的實體儲存空間',
      ja: 'アプリケーションの物理的なストレージ領域'
    }
  },
  {
    id: 'Q07',
    text: {
      zh: '將訓練好的AI模型，存入電腦當中。',
      ja: '訓練済みのAIモデルをパソコンに保存する。'
    },
    answer: 'NAND',
    hint: {
      zh: '檔案寫入保存，準備日後使用',
      ja: 'ファイルを書き込んで保存し、後日使用する準備をする'
    }
  },
  {
    id: 'Q08',
    text: {
      zh: '在測試時，用AI模型即時推論移動代號，讓魷魚知道要往哪裡移動。',
      ja: 'テスト時、AIモデルを使用して移動コードをリアルタイムで推論し、イカにどこに移動すべきかを知らせる。'
    },
    answer: 'DRAM',
    hint: {
      zh: '高速運算與即時推論的暫存',
      ja: '高速演算とリアルタイム推論の一時保存'
    }
  },
  {
    id: 'Q09',
    text: {
      zh: '你正在使用手機的拍照 APP 套用最新的 AI 即時濾鏡，畫面上你的臉部表情會隨著濾鏡同步變動，這些為了讓濾鏡即時呈現而快速運算的影像數據。',
      ja: 'スマホのカメラアプリで最新のAIリアルタイムフィルターを適用しています。画面上の顔の表情がフィルターと同期して変化します。これらはフィルターをリアルタイムで表示するために高速演算される画像データです。'
    },
    answer: 'DRAM',
    hint: {
      zh: '瞬間處理的龐大運算負載',
      ja: '瞬間的に処理される膨大な演算負荷'
    }
  },
  {
    id: 'Q10',
    text: {
      zh: '登入PAIA後，開啟前一天儲存的專案。',
      ja: 'PAIAにログイン後、前日保存したプロジェクトを開く。'
    },
    answer: 'NAND',
    hint: {
      zh: '喚醒先前長期儲存的資料',
      ja: '以前に長期保存されたデータを呼び起こす'
    }
  }
];

const TIME_LIMIT_MS = 8000; // 每題 8 秒

export default function App() {
  // 遊戲與語言狀態
  const [lang, setLang] = useState('zh');
  const l = t[lang]; // 捷徑取得當前語言字串
  
  const [gameState, setGameState] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);
  
  const [feedback, setFeedback] = useState(null); 
  const [showCountdownText, setShowCountdownText] = useState('');

  // --- 遊戲邏輯 ---
  const startGame = () => {
    setGameState('demo');
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
  };

  const startCountdown = () => {
    setGameState('countdown');
    let count = 3;
    setShowCountdownText(count.toString());
    
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setShowCountdownText(count.toString());
      } else if (count === 0) {
        setShowCountdownText(t[lang].startText);
      } else {
        clearInterval(interval);
        setGameState('playing');
        setCurrentQuestionIndex(0);
        setTimeLeft(TIME_LIMIT_MS);
      }
    }, 1000);
  };

  const handleAnswer = useCallback((selectedAnswer) => {
    if (feedback !== null) return; 

    const isDemo = gameState === 'demo';
    const currentQList = isDemo ? demoQuestions : gameQuestions;
    const currentQ = currentQList[currentQuestionIndex];
    
    let isCorrect = selectedAnswer === currentQ.answer;

    if (isCorrect) {
      setFeedback('correct');
      if (gameState === 'playing') setScore(s => s + 1);
    } else {
      setFeedback('wrong');
    }
  }, [gameState, currentQuestionIndex, feedback]);

  const handleTimeout = useCallback(() => {
    if (feedback !== null || gameState !== 'playing') return;
    setFeedback('timeout');
  }, [feedback, gameState]);

  const handleNextPhase = useCallback(() => {
    if (feedback === null) return;

    const isDemo = gameState === 'demo';
    const currentQList = isDemo ? demoQuestions : gameQuestions;

    if (isDemo && feedback === 'wrong') {
      setFeedback(null);
    } else {
      if (currentQuestionIndex < currentQList.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setFeedback(null);
        if (gameState === 'playing') setTimeLeft(TIME_LIMIT_MS);
      } else {
        if (gameState === 'demo') {
          setFeedback(null); 
          startCountdown();
        } else {
          setGameState('result');
        }
      }
    }
  }, [feedback, gameState, currentQuestionIndex]);

  useEffect(() => {
    if (gameState === 'playing' && feedback === null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 100) return 0;
          return prev - 100;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [gameState, feedback]);

  useEffect(() => {
    if (gameState === 'playing' && feedback === null && timeLeft === 0) {
      handleTimeout();
    }
  }, [gameState, feedback, timeLeft, handleTimeout]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (feedback !== null) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextPhase();
        }
        return;
      }

      if (gameState === 'demo' || gameState === 'playing') {
        if (e.key === 'ArrowLeft') {
          handleAnswer('DRAM');
        } else if (e.key === 'ArrowRight') {
          handleAnswer('NAND');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleAnswer, feedback, handleNextPhase]);

  // 切換語言處理函數
  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'ja' : 'zh');
  };

  const LanguageSwitcher = () => (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
      <div className="bg-slate-800/80 backdrop-blur-md rounded-full flex p-0.5 shadow-lg border border-slate-600/60">
        <button 
          onClick={() => setLang('zh')}
          className={`w-10 py-1 text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center ${lang === 'zh' ? 'bg-blue-500 text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
        >
          中
        </button>
        <button 
          onClick={() => setLang('ja')}
          className={`w-10 py-1 text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center ${lang === 'ja' ? 'bg-blue-500 text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}
        >
          日
        </button>
      </div>
    </div>
  );

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl px-6 text-center space-y-8 animate-fade-in text-white pt-10">
      <h1 className={`font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-400 drop-shadow-lg pb-2 ${lang === 'ja' ? 'text-2xl sm:text-3xl md:text-5xl lg:text-5xl whitespace-normal' : 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap'}`}>
        {l.title}
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">{l.subtitle}</h2>
      
      <div className="bg-slate-800/90 p-8 rounded-2xl shadow-xl border border-slate-600 text-left max-w-3xl space-y-6">
        <p className="text-lg text-slate-200 leading-relaxed">
          {l.intro}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-900/40 p-5 rounded-xl border border-blue-500/30">
            <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2 mb-2">
              <Zap size={24} className="shrink-0" /> {l.dramTitle}
            </h3>
            <p className="text-sm text-slate-300">
              {l.dramDesc}
            </p>
          </div>
          <div className="bg-orange-900/40 p-5 rounded-xl border border-orange-500/30">
            <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2 mb-2">
              <Database size={24} className="shrink-0" /> {l.nandTitle}
            </h3>
            <p className="text-sm text-slate-300">
              {l.nandDesc}
            </p>
          </div>
        </div>
      </div>

      <button 
        onClick={startGame}
        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-bold text-2xl rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center gap-3 overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        {l.startBtn} <Play fill="currentColor" />
      </button>
    </div>
  );

  const renderGameArea = (isDemo = false) => {
    const currentQList = isDemo ? demoQuestions : gameQuestions;
    const currentQ = currentQList[currentQuestionIndex];
    const progressPercent = (timeLeft / TIME_LIMIT_MS) * 100;
    
    let progressColor = 'bg-green-500';
    if (progressPercent < 50) progressColor = 'bg-yellow-400';
    if (progressPercent < 25) progressColor = 'bg-red-500 animate-pulse';

    return (
      <div className="relative w-full h-full flex overflow-hidden bg-slate-900">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full bg-blue-950/40 border-r border-slate-700/50"></div>
          <div className="w-1/2 h-full bg-orange-950/40"></div>
        </div>

        <div className="absolute top-0 left-0 w-full z-20 flex flex-col items-center pt-6 px-8 pointer-events-none mt-8 md:mt-0">
          <div className="flex justify-between w-full max-w-4xl text-white font-bold md:text-xl mb-4 text-sm">
            <span className="bg-slate-800 px-4 py-1 rounded-full border border-slate-600 shadow-md">
              {isDemo ? l.demoTag : l.qProgress(currentQuestionIndex + 1, 10)}
            </span>
            {!isDemo && (
              <span className="bg-slate-800 px-4 py-1 rounded-full border border-slate-600 flex items-center gap-2 shadow-md">
                <Trophy size={18} className="text-yellow-400" /> {l.scoreStr} {score}
              </span>
            )}
          </div>
          
          {!isDemo && (
            <div className="w-full max-w-3xl h-3 md:h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
              <div 
                className={`h-full ${progressColor} transition-all duration-100 ease-linear`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex z-10">
          <button 
            onClick={() => handleAnswer('DRAM')}
            disabled={feedback !== null}
            className="w-1/2 h-full flex flex-col items-start justify-center pl-4 sm:pl-8 md:pl-16 lg:pl-24 opacity-50 hover:opacity-100 hover:bg-blue-600/20 transition-all cursor-pointer group relative"
          >
            <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-300 mt-48 md:mt-64">
              <Zap className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] w-[64px] h-[64px] md:w-[100px] md:h-[100px]" />
              <div className="mt-3 md:mt-5 flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-bold text-blue-400 tracking-wider">DRAM</span>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleAnswer('NAND')}
            disabled={feedback !== null}
            className="w-1/2 h-full flex flex-col items-end justify-center pr-4 sm:pr-8 md:pr-16 lg:pr-24 opacity-50 hover:opacity-100 hover:bg-orange-600/20 transition-all cursor-pointer group relative"
          >
            <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-300 mt-48 md:mt-64">
              <Database className="text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)] w-[64px] h-[64px] md:w-[100px] md:h-[100px]" />
              <div className="mt-3 md:mt-5 flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-bold text-orange-400 tracking-wider text-center">NAND<br className="md:hidden"/> Flash</span>
              </div>
            </div>
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4 md:px-12 mt-12 md:mt-0">
          <div className={`bg-slate-800/95 border-2 border-slate-600 rounded-3xl p-6 md:p-8 max-w-3xl w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] transform transition-transform duration-300 mb-32 md:mb-48 ${feedback ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
            <h2 className={`font-medium text-white leading-relaxed md:leading-relaxed ${lang === 'ja' ? 'text-md md:text-xl' : 'text-lg md:text-2xl'}`}>
              {currentQ.text[lang]}
            </h2>
          </div>
        </div>

        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-900/90 animate-fade-in px-4">
            <div className={`bg-slate-800 border-4 rounded-3xl p-6 md:p-10 max-w-2xl w-full text-center shadow-2xl transform transition-transform animate-pop-in flex flex-col items-center
              ${feedback === 'correct' ? 'border-green-500' : (feedback === 'timeout' ? 'border-yellow-500' : 'border-red-500')}
            `}>
              
              {feedback === 'correct' && <CheckCircle size={80} className="text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-bounce" />}
              {feedback === 'wrong' && <XCircle size={80} className="text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-shake" />}
              {feedback === 'timeout' && <Clock size={80} className="text-yellow-500 mb-4 animate-pulse" />}
              
              <div className="bg-slate-700/60 p-5 md:p-8 rounded-2xl border-2 border-slate-600 mt-2 mb-6 w-full">
                <p className={`text-slate-100 font-medium flex items-start justify-center gap-4 text-left leading-relaxed ${lang === 'ja' ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                  <AlertCircle className="shrink-0 mt-1 text-blue-400" size={32} />
                  <span>{currentQ.hint[lang]}</span>
                </p>
              </div>

              {feedback === 'correct' && (
                <p className="text-2xl md:text-4xl text-green-400 font-bold mb-8">{l.ansIs} {currentQ.answer}</p>
              )}
              {feedback === 'wrong' && (
                gameState === 'demo' ? (
                  <p className="text-2xl md:text-4xl text-red-400 font-bold mb-8">{l.wrongDemo}</p>
                ) : (
                  <p className="text-2xl md:text-4xl text-red-400 font-bold mb-8">{l.wrongReal} {currentQ.answer}</p>
                )
              )}
              {feedback === 'timeout' && (
                <p className="text-2xl md:text-4xl text-yellow-400 font-bold mb-8">{l.timeoutStr} {currentQ.answer}</p>
              )}

              <button
                onClick={handleNextPhase}
                className="w-full py-4 md:py-5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl md:text-2xl rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 border border-slate-500"
              >
                {gameState === 'demo' && feedback === 'wrong' ? l.retryBtn : l.nextBtn} <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCountdown = () => (
    <div className="flex items-center justify-center h-full w-full bg-slate-900">
      <h1 className="text-[80px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 animate-pulse drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]">
        {showCountdownText}
      </h1>
    </div>
  );

  const renderResult = () => {
    const stickers = score;
    let title = l.resultDone;
    let titleColor = "text-white";

    if (score === 10) {
      title = l.resultPerfect;
      titleColor = "text-yellow-400";
    } else if (score >= 7) {
      title = l.resultGood;
      titleColor = "text-blue-400";
    }

    return (
      <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl px-6 text-center space-y-8 animate-fade-in text-white py-12 overflow-y-auto">
        <Trophy size={80} className="text-yellow-400 mb-4 mt-8 md:mt-0 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
        <h1 className={`text-3xl md:text-6xl font-black ${titleColor}`}>{title}</h1>
        
        <div className="bg-slate-800 p-6 md:p-8 rounded-3xl border-2 border-slate-600 shadow-2xl w-full max-w-md my-8">
          <p className="text-xl md:text-2xl text-slate-300 mb-2">{l.correctCount}</p>
          <p className="text-5xl md:text-6xl font-bold text-white mb-6">{score} / 10</p>
          <div className="h-px w-full bg-slate-700 mb-6"></div>
          <p className="text-lg md:text-xl text-slate-300">{l.congratsGot}</p>
          <p className="text-3xl md:text-4xl font-bold text-green-400 mt-2">{stickers} {l.stickersUnit}</p>
        </div>

        <div className="bg-slate-800/90 p-6 md:p-8 rounded-2xl border border-slate-600 text-left w-full max-w-3xl mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">{l.conclusionTitle}</h3>
          <p className="text-slate-300 leading-relaxed mb-4 text-sm md:text-base">
            {l.conclusionP1}
          </p>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            {l.conclusionP2}
          </p>
        </div>

        <button 
          onClick={() => setGameState('start')}
          className="px-8 py-3 bg-slate-700 text-white font-bold text-xl rounded-full hover:bg-slate-600 transition-colors flex items-center gap-2 mb-8"
        >
          {l.returnBtn}
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-slate-900 font-sans overflow-hidden text-slate-800 select-none flex items-center justify-center">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shake { 
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />

      <LanguageSwitcher />

      {gameState === 'start' && renderStartScreen()}
      {gameState === 'demo' && renderGameArea(true)}
      {gameState === 'countdown' && renderCountdown()}
      {gameState === 'playing' && renderGameArea(false)}
      {gameState === 'result' && renderResult()}
    </div>
  );
}