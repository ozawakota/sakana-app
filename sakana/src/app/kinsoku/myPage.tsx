"use client"


export default function Kinsoku() {

  return (
    <section className="p-4 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 md:mb-10">禁則処理について</h1>
        <h2>CSSの縦書き段組みの問題点</h2>
        <ul>
          <li>ブラウザによって表示が大きく違う。</li>
          <li>段組みを行うと表示領域の大きさが正しく認識されなくなる。(レイアウト崩壊に)</li>
          <li>段組みを行うとコンテンツの量が少ない場合でも勝手に4段組みになりコンテンツ幅が狭くなる。</li>
          <li>幅・高さ・縦位置・横位置の指定が正しく処理されない。</li>
        </ul>
        <h2>条件</h2>
        <ol className="mb-4 space-2">
          <li>webフォント（noto san JP）を使用すること</li>
          <li>ピクセルを使用（vwとかではない）</li>
          <li>句読点が文頭に来る場合は、前の文章の最後尾に表示する。</li>
          <li>「が文末に来る場合は、次の文章の頭に表示する。</li>
          <li>」が文頭に来る場合は、前の文章の最後尾に表示する。</li>
          <li>小文字が文頭に来る場合は、前の文章の最後尾に表示する。</li>
          <li>伸ばし棒が文末に来る場合は、次の文章の頭に表示する。</li>
          <li>泣き別れ禁止</li>
          <li>接着文字を設定可能とする。</li>
        </ol>
        <h2 className="mt-4">横書き(禁則処理なし)</h2>
        <div className="border mt-4 p-2 bg-white text-black w-[420px]">
          <p>
          親譲りの無鉄砲で小供の時から損ばかりしている。<span className="!underline decoration-solid">小学校</span>に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、「同級生」の一人が「冗談」に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。<span className='!underline decoration-wavy'>小使に負ぶさって帰って来た時</span>、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
          </p>
        </div>
        <h2 className="mt-4">縦書き(禁則処理なし)</h2>
        <div className="border mt-4 p-2 [writing-mode:vertical-rl] h-[205px] w-[500px] bg-white text-black overflow-y-auto">
          <p>
          親譲りの無鉄砲で小供の時から損ばかりしている。<span className="underline decoration-solid ">小学校</span>に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、「同級生」の一人が「冗談」に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。<span className='underline decoration-wavy'>小使に負ぶさって帰って来た時</span>、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
          </p>
        </div>
        <div className="border m-8"></div>
        <h2 className="mt-4">横書き(禁則処理あり)</h2>
        <div className="border mt-4 p-2 bg-white text-black w-[420px] kinsoku">
          <p>
          親譲りの無鉄砲で小供の時から損ばかりしている。<span className="text-decoration-line !underline decoration-solid inline-block">小学校</span>に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、「同級生」の一人が「冗談」に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。<span className='text-decoration-line !underline decoration-wavy'>小使に負ぶさって帰って来た時</span>、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
          </p>
        </div>
        <h2 className="mt-4">縦書き(禁則処理あり)</h2>
        <div className="border mt-4 p-2 [writing-mode:vertical-rl] h-[205px] w-[500px] bg-white text-black overflow-y-auto kinsoku ">
          <p>
          <ruby>
              <rb>親譲</rb>
              <rt>おやゆず</rt>
            </ruby>りの無鉄砲で<u className="text-decoration-line">小供の時</u>から損ばかりしている。<span className="text-decoration-line underline decoration-solid inline-block">小学校</span>に居る時分学校の<span className="inline-block">二階</span>から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、「同級生」の一人が<span className="inline-block">「冗談」</span>に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。<span className='text-decoration-line decoration-wavy'>小使に負ぶさって帰って来た時</span>、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
          </p>
        </div>

      </div>
    </section>
  )
}