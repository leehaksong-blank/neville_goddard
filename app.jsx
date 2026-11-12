const { useState, useEffect } = React;

// 기본 내장된 1번 강의 샘플 (나중에 lectures/001.json 파일을 만들면 자동으로 그 파일을 불러옵니다)
const DEFAULT_LECTURE_1 = [
  {
    id: 1, p: 1,
    en: "Christmas is the proclamation of a divine event to which all creation aspires.",
    ko: "크리스마스는 모든 피조물이 열망하는 신적 사건을 선포하는 날입니다.",
    vocab: [
      { word: "proclamation", mean: "선언, 선포" },
      { word: "divine", mean: "신성한, 신의" },
      { word: "creation", mean: "(집합적) 모든 피조물, 창조 세계" },
      { word: "aspire to", mean: "~을 열망하다, 염원하다" }
    ],
    grammar: [
      { tag: "전치사 + 관계대명사 (to which)", desc: "선행사 a divine event를 수식합니다. 본래 all creation aspires to the event 구조에서 전치사 to가 관계대명사 which 앞으로 이동하여 결합했습니다." }
    ]
  },
  {
    id: 2, p: 1,
    en: "It is an event which puts an entirely different light upon human life, for it proclaims that man has been saved.",
    ko: "이 사건은 인간의 삶을 완전히 다른 시각으로 보게 만드는데, 왜냐하면 인간이 이미 구원받았음을 선포하기 때문입니다.",
    vocab: [
      { word: "put ~ upon a different light", mean: "~을 새로운 각도/시각에서 보게 하다" },
      { word: "entirely", mean: "전적으로, 완전히" },
      { word: "for", mean: "[접속사] 왜냐하면 ~이므로 (앞 절의 근거 제시)" },
      { word: "man", mean: "[무관사 단수] 인류, 인간 일반" }
    ],
    grammar: [
      { tag: "주격 관계대명사 (which)", desc: "선행사 an event를 수식하는 형용사절을 이끕니다." },
      { tag: "현재완료 수동태 (has been saved)", desc: "구원이 미래의 조건부 사건이 아니라 이미 완료되어 현재까지 확정된 상태임을 나타냅니다." }
    ]
  }
];

// 294개 강의 목록 자동 생성
const LECTURE_LIST = Array.from({ length: 294 }, (_, i) => ({
  id: i + 1,
  title: i === 0 ? "A Divine Event (1969-12-08)" : i === 1 ? "A Lesson in Scripture" : `Lecture #${i + 1}`
}));

function App() {
  const [selectedId, setSelectedId] = useState(1);
  const [sentences, setSentences] = useState(DEFAULT_LECTURE_1);
  const [quizMode, setQuizMode] = useState(false);

  // 강의를 클릭할 때마다 lectures/001.json 같은 데이터 파일을 자동으로 찾아오는 기능
  useEffect(() => {
    const fileNum = String(selectedId).padStart(3, "0");
    fetch(`./lectures/${fileNum}.json`)
      .then(res => {
        if (!res.ok) throw new Error("파일 없음");
        return res.json();
      })
      .then(data => setSentences(data))
      .catch(() => {
        // 아직 json 파일이 없으면 1번 강의는 기본 데이터, 나머지는 빈 화면 표시
        setSentences(selectedId === 1 ? DEFAULT_LECTURE_1 : []);
      });
  }, [selectedId]);

  // 원어민 발음 듣기 (TTS)
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 294개 강의 목록 */}
      <aside className="w-full md:w-72 bg-slate-900 text-white p-4 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <h1 className="text-lg font-bold text-amber-400 mb-3">네빌 고다드 294 강의</h1>
        <div className="space-y-1">
          {LECTURE_LIST.map(lec => (
            <button
              key={lec.id}
              onClick={() => setSelectedId(lec.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                selectedId === lec.id ? "bg-amber-500 text-slate-900 font-bold" : "hover:bg-slate-800"
              }`}
            >
              #{String(lec.id).padStart(3, "0")} {lec.title}
            </button>
          ))}
        </div>
      </aside>

      {/* 오른쪽 영어 학습 화면 */}
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24pt" }} className="font-bold">
            #{String(selectedId).padStart(3, "0")}. {LECTURE_LIST[selectedId - 1]?.title}
          </h2>
          <button
            onClick={() => setQuizMode(!quizMode)}
            className="px-4 py-2 rounded bg-slate-800 text-white text-xs font-bold"
          >
            {quizMode ? "🙈 해석 보이기" : "🙈 해석 가리기 연습"}
          </button>
        </div>

        {sentences.length === 0 ? (
          <div className="p-8 bg-white rounded-xl border text-center text-stone-500">
            아직 <code>lectures/{String(selectedId).padStart(3, "0")}.json</code> 파일이 업로드되지 않았습니다.
          </div>
        ) : (
          <div className="space-y-6">
            {sentences.map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">SENTENCE {idx + 1}</span>
                  <button
                    onClick={() => speak(s.en)}
                    className="px-3 py-1 bg-amber-100 text-amber-900 rounded text-xs font-bold"
                  >
                    🔊 발음 듣기
                  </button>
                </div>

                {/* 영문 (Georgia 14pt, 줄간격 1.55) */}
                <p style={{ fontFamily: "Georgia, serif", fontSize: "14pt", lineHeight: "1.55" }} className="font-semibold mb-3">
                  {s.en}
                </p>

                {/* 한글 해석 */}
                <p className={`p-3 bg-slate-50 border-l-4 border-slate-700 rounded mb-4 ${quizMode ? "blur-sm hover:blur-none transition" : ""}`}>
                  {s.ko}
                </p>

                {/* 핵심 단어 & 문법 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t text-sm">
                  <div>
                    <div className="font-bold text-xs text-slate-500 mb-1">[핵심 어휘]</div>
                    {s.vocab.map((v, i) => (
                      <div key={i}><b>{v.word}</b> : {v.mean}</div>
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-500 mb-1">[구문 포인트]</div>
                    {s.grammar.map((g, i) => (
                      <div key={i}><b className="text-blue-800">{g.tag}</b> — {g.desc}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
