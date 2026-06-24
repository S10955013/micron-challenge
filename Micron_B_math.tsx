import React, { useState, useEffect, useCallback } from "react";
import {
  RotateCcw,
  ArrowRight,
  Play,
  CheckCircle,
  XCircle,
  Award,
  MousePointerClick,
  Code2,
  AlertCircle,
  Clock,
} from "lucide-react";

// 多國語言字典
const TRANSLATIONS = {
  zh: {
    title: "透過程式驗證結果：像工程師一樣思考",
    demoTitle: "關主操作示範",
    demoBadge: "範例題",
    subtitle: "結合運算思維與數學，讓等式完美成立！",
    startBtn: "開始挑戰",
    startRealGame: "正式開始挑戰",
    awesome: "太厲害了！",
    finishText: "你不僅精通數學運算，更完美克服了資源限制與邏輯挑戰！",
    playAgain: "再玩一次",
    level: "關卡",
    logicMode: "if-else 版",
    limitMode: "數量限制",
    tracker: "邏輯追蹤器",
    correctMsg: "✓ 算式正確！",
    tooBigMsg: "✗ 數值太大了",
    tooSmallMsg: "✗ 數值太小了",
    clearBtn: "清除重來",
    nextBtn: "下一關",
    remain: "剩",
    timeElapsed: "總共耗時：",
    errorInf: "無限大(錯誤)",
  },
  ja: {
    title: "プログラムで結果を検証する：エンジニアのように考える",
    demoTitle: "マスター操作デモ",
    demoBadge: "例題",
    subtitle: "論理的思考と数学を組み合わせて、等式を完成させよう！",
    startBtn: "チャレンジ開始",
    startRealGame: "本番チャレンジ開始",
    awesome: "すばらしい！",
    finishText:
      "数学の計算だけでなく、資源の制限や論理的課題も見事にクリアしました！",
    playAgain: "もう一度プレイ",
    level: "ステージ",
    logicMode: "if-else 版",
    limitMode: "回数制限",
    tracker: "ロジックトラッカー",
    correctMsg: "✓ 正解です！",
    tooBigMsg: "✗ 値が大きすぎます",
    tooSmallMsg: "✗ 値が小さすぎます",
    clearBtn: "やり直す",
    nextBtn: "次のステージへ",
    remain: "残",
    timeElapsed: "クリアタイム：",
    errorInf: "エラー(無限大)",
  },
};

// 遊戲關卡設計 (加入第 0 關作為關主範例)
const LEVELS = [
  {
    numbers: [1, 2, 3, 4],
    target: 10,
    desc: { zh: "", ja: "" },
    isDemo: true,
  },
  {
    numbers: [3, 3, 3],
    target: 6,
    desc: { zh: "經典暖身題", ja: "定番のウォーミングアップ" },
  },
  {
    numbers: [5, 5, 5],
    target: 6,
    desc: { zh: "這題要用到除法喔", ja: "割り算を使う問題です" },
  },
  {
    numbers: [4, 4, 4, 4],
    target: 24,
    desc: {
      zh: "湊出 24 (注意先乘除後加減，有多解)",
      ja: "24を作る（掛け算・割り算優先、複数解あり）",
    },
  },
  {
    numbers: [6, 8, 4, 2],
    target: 10,
    desc: {
      zh: "不同數字的混合運算 (有多解)",
      ja: "異なる数字の混合計算（複数解あり）",
    },
  },
  {
    numbers: [5, 5, 5, 5],
    target: 24,
    desc: {
      zh: "進階挑戰：這個 24 不好湊！",
      ja: "上級チャレンジ：この24は少し難しい！",
    },
  },
  {
    numbers: [9, 8, 6, 7],
    target: 5,
    desc: {
      zh: "魔王題：善用乘法與除法的搭配",
      ja: "ボス問題：掛け算と割り算の組み合わせを活用しよう",
    },
  },
  {
    numbers: [9, 3, 4, 2, 5, 1],
    target: 10,
    desc: {
      zh: "資源分配題：只需填入 5 個符號，每個符號最多使用 2 次！",
      ja: "資源配分問題：5つの記号を入力、各記号は最大2回まで！",
    },
    operatorLimits: { "+": 2, "-": 2, "×": 2, "÷": 2 },
  },
  {
    numbers: [5, 9, 3, 6, 2],
    target: 19,
    desc: {
      zh: "終極挑戰：每個符號最多使用 2 次，找出能得出 19 的組合！",
      ja: "究極の挑戦：各記号は最大2回まで、19になる組み合わせを見つけよう！",
    },
    operatorLimits: { "+": 2, "-": 2, "×": 2, "÷": 2 },
  },
  {
    numbers: [6, 6, 6, 6],
    targetDisplay: { zh: "奇數", ja: "奇数" },
    desc: {
      zh: "邏輯題：全都是偶數怎麼變奇數？試著進入 if (奇數) 區塊！",
      ja: "論理問題：全て偶数から奇数を作るには？ if (奇数) ブロックに入ろう！",
    },
    isLogicMode: true,
    checkResult: (res) => Number.isInteger(res) && Math.abs(res % 2) === 1,
    logicBlocks: [
      {
        label: "if (result % 2 !== 0)",
        desc: {
          zh: "// ✓ 結果是奇數！",
          ja: "// ✓ 結果は奇数です！",
        },
        isMatch: (res) =>
          res !== null && Number.isInteger(res) && Math.abs(res % 2) === 1,
      },
      {
        label: "else",
        desc: {
          zh: "// ✗ 結果是偶數或小數",
          ja: "// ✗ 結果は偶数または小数です",
        },
        isMatch: (res) =>
          res !== null && (!Number.isInteger(res) || res % 2 === 0),
      },
    ],
  },
  {
    numbers: [2, 3, 4, 5],
    targetDisplay: { zh: "< 0", ja: "< 0" },
    desc: {
      zh: "終極邏輯題：符號各最多1次，想辦法讓結果小於零！",
      ja: "究極の論理問題：各記号は最大1回、結果をゼロ未満にしよう！",
    },
    isLogicMode: true,
    checkResult: (res) => res < 0,
    operatorLimits: { "+": 1, "-": 1, "×": 1, "÷": 1 },
    logicBlocks: [
      {
        label: "if (result < 0)",
        desc: {
          zh: "// ✓ 成功製造出負數！",
          ja: "// ✓ 負の数を作ることに成功しました！",
        },
        isMatch: (res) => res !== null && res < 0,
      },
      {
        label: "else if (result === 0)",
        desc: {
          zh: "// ✗ 結果剛好等於 0",
          ja: "// ✗ 結果はちょうど0です",
        },
        isMatch: (res) => res !== null && res === 0,
      },
      {
        label: "else",
        desc: {
          zh: "// ✗ 結果大於 0",
          ja: "// ✗ 結果は0より大きいです",
        },
        isMatch: (res) => res !== null && res > 0,
      },
    ],
  },
];

const OPERATORS = ["+", "-", "×", "÷"];

export default function App() {
  const [lang, setLang] = useState("zh");
  const [gameState, setGameState] = useState("playing");
  const [level, setLevel] = useState(0);

  const [slots, setSlots] = useState(
    Array(LEVELS[0].numbers.length - 1).fill("")
  );

  const [activeSlot, setActiveSlot] = useState(0);
  const [status, setStatus] = useState("idle");
  const [expressionResult, setExpressionResult] = useState(null);

  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const t = TRANSLATIONS[lang];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    let timer;
    if (
      gameState === "playing" &&
      startTime !== null &&
      !LEVELS[level].isDemo
    ) {
      timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, startTime, level]);

  const initLevel = useCallback((lvlIndex) => {
    setLevel(lvlIndex);
    setSlots(Array(LEVELS[lvlIndex].numbers.length - 1).fill(""));
    setActiveSlot(0);
    setStatus("idle");
    setExpressionResult(null);
  }, []);

  const startGame = () => {
    setGameState("playing");
    initLevel(1);
    setStartTime(Date.now());
    setTimeElapsed(0);
  };

  const checkAnswer = useCallback(
    (currentSlots) => {
      const currentPuzzle = LEVELS[level];
      let expression = "";

      for (let i = 0; i < currentPuzzle.numbers.length; i++) {
        expression += currentPuzzle.numbers[i];
        if (i < currentSlots.length && currentSlots[i]) {
          let op = currentSlots[i];
          if (op === "×") expression += " * ";
          else if (op === "÷") expression += " / ";
          else expression += ` ${op} `;
        }
      }

      try {
        const evaluateExpression = new Function("return " + expression);
        const result = evaluateExpression();

        const finalResult =
          isNaN(result) || !isFinite(result) ? "Error" : result;
        setExpressionResult(finalResult);

        if (finalResult === "Error") {
          setStatus("wrong");
          return;
        }

        if (currentPuzzle.isLogicMode) {
          if (currentPuzzle.checkResult(finalResult)) {
            setStatus("correct");
          } else {
            setStatus("wrong");
          }
        } else {
          if (Math.abs(finalResult - currentPuzzle.target) < 0.0001) {
            setStatus("correct");
          } else {
            setStatus("wrong");
          }
        }
      } catch (e) {
        setStatus("wrong");
      }
    },
    [level]
  );

  const getRemainingCount = useCallback(
    (op) => {
      const currentPuzzle = LEVELS[level];
      if (
        !currentPuzzle.operatorLimits ||
        currentPuzzle.operatorLimits[op] === undefined
      ) {
        return null;
      }
      const usedCount = slots.filter((s) => s === op).length;
      return currentPuzzle.operatorLimits[op] - usedCount;
    },
    [level, slots]
  );

  const handleOperator = useCallback(
    (op) => {
      const currentPuzzle = LEVELS[level];
      if (status === "correct" && !currentPuzzle.isDemo) return;
      if (activeSlot === -1) return;

      const remaining = getRemainingCount(op);
      if (remaining !== null && remaining <= 0) return;

      const newSlots = [...slots];
      newSlots[activeSlot] = op;
      setSlots(newSlots);

      const nextEmpty = newSlots.findIndex((s) => s === "");
      if (nextEmpty !== -1) {
        setActiveSlot(nextEmpty);
        setStatus("idle");
        setExpressionResult(null);
      } else {
        setActiveSlot(-1);
        checkAnswer(newSlots);
      }
    },
    [status, activeSlot, slots, checkAnswer, getRemainingCount, level]
  );

  const handleSlotClick = (index) => {
    const currentPuzzle = LEVELS[level];
    if (status === "correct" && !currentPuzzle.isDemo) return;

    const newSlots = [...slots];
    if (newSlots[index] !== "") {
      newSlots[index] = "";
      setSlots(newSlots);
    }

    setActiveSlot(index);
    setStatus("idle");
    setExpressionResult(null);
  };

  const handleClear = () => {
    setSlots(Array(LEVELS[level].numbers.length - 1).fill(""));
    setActiveSlot(0);
    setStatus("idle");
    setExpressionResult(null);
  };

  const handleNextLevel = () => {
    if (level === 0) {
      setStartTime(Date.now());
      setTimeElapsed(0);
    }
    if (level + 1 < LEVELS.length) {
      initLevel(level + 1);
    } else {
      setGameState("finished");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "playing") return;
      if (e.key === "+") handleOperator("+");
      if (e.key === "-") handleOperator("-");
      if (e.key === "*" || e.key === "x" || e.key === "X") handleOperator("×");
      if (e.key === "/") handleOperator("÷");
      if (e.key === "Backspace") {
        const newSlots = [...slots];
        if (activeSlot !== -1 && newSlots[activeSlot] !== "") {
          newSlots[activeSlot] = "";
          setSlots(newSlots);
        } else if (activeSlot > 0) {
          newSlots[activeSlot - 1] = "";
          setSlots(newSlots);
          setActiveSlot(activeSlot - 1);
        } else if (activeSlot === -1) {
          newSlots[slots.length - 1] = "";
          setSlots(newSlots);
          setActiveSlot(slots.length - 1);
        }
        setStatus("idle");
        setExpressionResult(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, slots, activeSlot, status, handleOperator]);

  const LanguageSwitcher = () => (
    <div className="absolute top-2.5 right-2.5 z-20 flex gap-1 bg-white/80 p-1 rounded-full shadow-sm backdrop-blur-sm">
      <button
        onClick={() => setLang("zh")}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          lang === "zh"
            ? "bg-blue-600 text-white shadow-md"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        中
      </button>
      <button
        onClick={() => setLang("ja")}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          lang === "ja"
            ? "bg-blue-600 text-white shadow-md"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        日
      </button>
    </div>
  );

  if (gameState === "finished") {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <LanguageSwitcher />
        <div className="bg-white rounded-2xl shadow-xl p-8 w-[95vw] max-w-[450px] mx-auto text-center border-t-8 border-green-500 flex flex-col h-[85vh]">
          <div className="mb-4 flex justify-center text-green-500 animate-bounce">
            <Award size={56} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {t.awesome}
          </h1>
          <p className="text-slate-600 mb-4 text-base flex-1">{t.finishText}</p>

          <div className="bg-slate-100 rounded-xl p-4 mb-6 flex flex-col items-center justify-center text-slate-700">
            <div className="flex items-center text-sm font-semibold mb-1">
              <Clock size={16} className="mr-1" /> {t.timeElapsed}
            </div>
            <div className="text-3xl font-mono font-bold text-blue-600">
              {formatTime(timeElapsed)}
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center mx-auto text-lg shadow-lg"
          >
            <RotateCcw size={20} className="mr-2" /> {t.playAgain}
          </button>
        </div>
      </div>
    );
  }

  const currentPuzzle = LEVELS[level];
  const progressPercent = currentPuzzle.isDemo
    ? 0
    : (level / (LEVELS.length - 1)) * 100;
  const hasLimits = currentPuzzle.operatorLimits !== undefined;

  const displayResult =
    expressionResult !== null && expressionResult !== "Error"
      ? Number.isInteger(expressionResult)
        ? expressionResult
        : expressionResult.toFixed(2)
      : expressionResult === "Error"
      ? t.errorInf
      : "?";

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col items-center p-3 md:p-6 font-sans relative overflow-hidden box-border">
      <LanguageSwitcher />

      {/* 頂部進度區塊 (寬度調整為 max-w-6xl) */}
      <div className="w-full max-w-6xl mb-3 flex flex-col shrink-0 px-1 md:px-2">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-slate-700 flex items-center flex-nowrap gap-2">
            {currentPuzzle.isDemo ? t.demoTitle : t.title}
            {currentPuzzle.isLogicMode && (
              <span className="text-pink-600 text-xs bg-pink-100 px-2 py-0.5 rounded-md whitespace-nowrap font-semibold">
                {t.logicMode}
              </span>
            )}
            {hasLimits && (
              <span className="text-purple-600 text-xs bg-purple-100 px-2 py-0.5 rounded-md flex items-center whitespace-nowrap font-semibold">
                <AlertCircle size={12} className="mr-1" /> {t.limitMode}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            {!currentPuzzle.isDemo && (
              <div className="flex items-center text-slate-500 font-mono text-sm font-bold bg-white px-2.5 py-1 rounded-md shadow-sm whitespace-nowrap border border-slate-200">
                <Clock size={14} className="mr-1" /> {formatTime(timeElapsed)}
              </div>
            )}
            <span
              className={`text-xs md:text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm ${
                currentPuzzle.isDemo
                  ? "text-pink-600 bg-pink-100"
                  : "text-blue-600 bg-blue-100"
              }`}
            >
              {currentPuzzle.isDemo
                ? t.demoBadge
                : `${t.level} ${level} / ${LEVELS.length - 1}`}
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out shadow-inner"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-slate-500 text-xs md:text-sm mt-1.5 font-medium truncate">
          {currentPuzzle.desc[lang]}
        </p>
      </div>

      {/* 主要內容區塊 (寬度放大到 max-w-6xl 解決留白問題，內邊距改為 p-4 md:p-6) */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col flex-1 overflow-hidden border border-slate-200">
        {/* 1. 等式顯示區 - 放大尺寸 */}
        <div className="flex flex-nowrap items-center justify-center gap-[clamp(0.4rem,1.5vw,0.75rem)] mb-4 shrink-0 w-full overflow-x-auto overflow-y-hidden pb-2 no-scrollbar">
          {currentPuzzle.numbers.map((num, idx) => (
            <React.Fragment key={`num-${idx}`}>
              {/* 數字方塊 (寬高放大) */}
              <div className="w-[clamp(2.5rem,10vw,4.5rem)] h-[clamp(3.25rem,11vw,5rem)] bg-slate-800 text-white rounded-xl flex items-center justify-center text-[clamp(1.5rem,5vw,2.25rem)] font-bold shadow-md shrink-0">
                {num}
              </div>

              {/* 運算符號插槽 (寬高放大) */}
              {idx < currentPuzzle.numbers.length - 1 && (
                <div
                  onClick={() => handleSlotClick(idx)}
                  className={`relative w-[clamp(2rem,8vw,3.5rem)] h-[clamp(2rem,8vw,3.5rem)] flex items-center justify-center text-[clamp(1.25rem,4.5vw,1.75rem)] font-bold rounded-lg cursor-pointer transition-all border-2 shrink-0
                    ${
                      activeSlot === idx && status !== "correct"
                        ? "border-blue-500 bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
                        : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                    }
                    ${
                      slots[idx]
                        ? "text-blue-600 border-solid"
                        : "text-transparent border-dashed"
                    }
                    ${
                      status === "correct"
                        ? "border-green-400 bg-green-50 text-green-600 cursor-default"
                        : ""
                    }
                    ${
                      status === "wrong" && slots[idx]
                        ? "border-red-400 bg-red-50 text-red-600"
                        : ""
                    }
                  `}
                >
                  {slots[idx]}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* 等號 */}
          {!(
            currentPuzzle.isLogicMode &&
            currentPuzzle.targetDisplay?.[lang] === "< 0"
          ) && (
            <div className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold text-slate-400 mx-[clamp(0.2rem,0.8vw,0.4rem)] shrink-0">
              {currentPuzzle.isLogicMode ? "→" : "="}
            </div>
          )}

          {/* 顯示結果目標 */}
          <div
            className={`h-[clamp(3.25rem,11vw,5rem)] rounded-xl flex items-center justify-center text-[clamp(1.25rem,4.5vw,1.75rem)] font-bold shadow-md transition-colors duration-300 shrink-0 whitespace-nowrap
            ${
              status === "correct"
                ? "bg-green-500 text-white border-transparent shadow-green-200"
                : "bg-slate-50 text-slate-700 border-2 border-slate-200"
            }
            ${
              !currentPuzzle.isLogicMode
                ? "min-w-[clamp(3.25rem,11vw,5rem)] px-2"
                : "px-[clamp(0.75rem,2.5vw,1.25rem)]"
            }
          `}
          >
            {currentPuzzle.isLogicMode
              ? currentPuzzle.targetDisplay[lang]
              : currentPuzzle.target}
          </div>
        </div>

        {/* 2. 運算符號鍵盤區 - 高度拉高，字體放大 */}
        <div className="grid grid-cols-4 gap-[clamp(0.35rem,1.8vw,0.75rem)] mb-4 shrink-0">
          {OPERATORS.map((op) => {
            const remaining = getRemainingCount(op);
            const isLimitReached = remaining !== null && remaining <= 0;
            const isDisabled =
              (status === "correct" && !currentPuzzle.isDemo) || isLimitReached;

            return (
              <button
                key={op}
                onClick={() => handleOperator(op)}
                disabled={isDisabled}
                className={`relative h-[clamp(3.25rem,11vw,4.5rem)] rounded-2xl text-[clamp(1.5rem,5.5vw,2.25rem)] font-bold transition-all shadow-[0_3px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-0.5
                  ${
                    isDisabled
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none translate-y-0.5"
                      : "bg-white text-blue-600 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50"
                  }
                `}
              >
                {op}
                {remaining !== null && (
                  <span
                    className={`absolute top-1 right-2 text-[10px] md:text-[11px] font-bold tracking-wider 
                    ${remaining === 0 ? "text-red-400" : "text-purple-500"}
                  `}
                  >
                    {t.remain}
                    {remaining}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. 程式邏輯追蹤區塊 - 縮小高度、減少內邊距以挪出空間給按鈕與等式 */}
        <div className="w-full bg-slate-900 rounded-xl p-3 mb-4 font-mono text-[13px] md:text-sm text-left shadow-inner overflow-hidden relative shrink-0 h-[220px] md:h-[280px] flex flex-col justify-start min-h-0 border border-slate-800">
          <div className="absolute top-1.5 right-3 text-slate-500 text-[15px] flex items-center">
            <Code2 size={11} className="mr-0.5" /> {t.tracker}
          </div>

          <div className="text-slate-300 mb-1 border-b border-slate-800 pb-1">
            <span className="text-blue-400">let</span> result ={" "}
            <span className="text-yellow-300 font-bold">{displayResult}</span>;
          </div>

          <div className="space-y-0.5 overflow-y-auto pr-1 custom-scrollbar flex-1">
            {currentPuzzle.isLogicMode ? (
              currentPuzzle.logicBlocks.map((block, idx) => {
                const active = block.isMatch(expressionResult);
                return (
                  <div
                    key={idx}
                    className={`pl-2 py-0.5 transition-all duration-300 border-l-2 ${
                      active
                        ? "bg-blue-900/40 border-blue-400 text-slate-200"
                        : "border-transparent opacity-75 text-slate-300"
                    }`}
                  >
                    <span className="text-pink-400">
                      {block.label.split(" ")[0]}
                    </span>{" "}
                    {block.label.substring(block.label.indexOf(" ") + 1)} {"{"}
                    <div
                      className={`pl-3 font-bold ${
                        active && status === "correct"
                          ? "text-green-400"
                          : active && status === "wrong"
                          ? "text-red-400"
                          : "text-slate-400 font-normal"
                      }`}
                    >
                      {block.desc[lang]}
                    </div>
                    {"}"}
                  </div>
                );
              })
            ) : (
              <>
                <div
                  className={`pl-2 py-0.5 transition-all duration-300 border-l-2 ${
                    status === "correct"
                      ? "bg-green-900/30 border-green-400 text-slate-200"
                      : "border-transparent opacity-75 text-slate-300"
                  }`}
                >
                  <span className="text-pink-400">if</span> (result ==={" "}
                  {currentPuzzle.target}) {"{"}
                  <div
                    className={`pl-3 font-bold ${
                      status === "correct"
                        ? "text-green-400"
                        : "text-slate-400 font-normal"
                    }`}
                  >
                    {t.correctMsg}
                  </div>
                  {"}"}
                </div>
                <div
                  className={`pl-2 py-0.5 transition-all duration-300 border-l-2 ${
                    status === "wrong" &&
                    expressionResult !== null &&
                    expressionResult > currentPuzzle.target
                      ? "bg-red-900/30 border-red-400 text-slate-200"
                      : "border-transparent opacity-75 text-slate-300"
                  }`}
                >
                  <span className="text-pink-400">else if</span> (result &gt;{" "}
                  {currentPuzzle.target}) {"{"}
                  <div
                    className={`pl-3 font-bold ${
                      status === "wrong" &&
                      expressionResult !== null &&
                      expressionResult > currentPuzzle.target
                        ? "text-red-400"
                        : "text-slate-400 font-normal"
                    }`}
                  >
                    {t.tooBigMsg}
                  </div>
                  {"}"}
                </div>
                <div
                  className={`pl-2 py-0.5 transition-all duration-300 border-l-2 ${
                    status === "wrong" &&
                    expressionResult !== null &&
                    expressionResult !== "Error" &&
                    expressionResult < currentPuzzle.target
                      ? "bg-red-900/30 border-red-400 text-slate-200"
                      : "border-transparent opacity-75 text-slate-300"
                  }`}
                >
                  <span className="text-pink-400">else</span> {"{"}
                  <div
                    className={`pl-3 font-bold ${
                      status === "wrong" &&
                      expressionResult !== null &&
                      expressionResult !== "Error" &&
                      expressionResult < currentPuzzle.target
                        ? "text-red-400"
                        : "text-slate-400 font-normal"
                    }`}
                  >
                    {t.tooSmallMsg}
                  </div>
                  {"}"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4. 底部控制列 - 按鈕放大 */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleClear}
            disabled={status !== "idle" && !currentPuzzle.isDemo}
            className={`flex-1 flex items-center justify-center py-3 md:py-4 rounded-xl font-bold transition-colors text-sm md:text-base shadow-sm
              ${
                status !== "idle" && !currentPuzzle.isDemo
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }
            `}
          >
            <RotateCcw size={18} className="mr-2" /> {t.clearBtn}
          </button>

          <button
            onClick={handleNextLevel}
            disabled={!currentPuzzle.isDemo && status !== "correct"}
            className={`flex-1 flex items-center justify-center py-3 md:py-4 rounded-xl font-bold transition-all text-sm md:text-base
              ${
                currentPuzzle.isDemo || status === "correct"
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-md transform hover:scale-[1.02]"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            {currentPuzzle.isDemo ? t.startRealGame : t.nextBtn}{" "}
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>

      {/* 隱藏滾動條的樣式設定 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
      `,
        }}
      />
    </div>
  );
}
