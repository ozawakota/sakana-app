"use client"

export default function About() {

  return (
    <section className="p-4">
      <div className="">
        <h1 className="text-2xl font-bold mb-4 md:mb-10 text-white">魚図鑑について</h1>
        <div className="text-white mb-16">
          <dl>
            <dt className="text-xl font-bold pb-4">実装環境(ツール)</dt>
            <dd>
              <ul>
                <li>next.js 14.2.5 </li>
                <li>@prisma/client 5.18.0 </li>
                <li>mysql 8.0</li>
                <li>TablePlus 6.1.2</li>
                <li>Docker 3.0</li>
                <li>Docker:Mailhog</li>
              </ul>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
