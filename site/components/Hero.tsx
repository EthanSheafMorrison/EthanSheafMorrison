export default function Hero() {
  return (
    <section className="text-black selection:bg-black selection:text-white py-10 md:py-20" style={{ background: "var(--background)" }}>
      <div className="site-grid">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-[var(--gutter)] py-8 md:py-12 border-b border-black/20">
            <div className="col-span-12 flex items-center justify-between text-xs md:text-sm uppercase tracking-widest font-medium">
              <span> </span>
              <span className="hidden md:block">Designer · Researcher · Aotearoa</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-[var(--gutter)] pt-8 md:pt-14">
            <div className="col-span-12 md:col-span-7">
              <h1 className="font-black uppercase leading-[0.9] tracking-[-0.04em] text-[14vw] md:text-[8rem]">
                <span className="block">Ethan&nbsp;—</span>
                <span className="block">Sheaf-Morrison</span>
                <span className="block"></span>
              </h1>
            </div>

            {/* <div className="col-span-12 md:col-span-5 md:pl-6 flex md:block items-start md:items-end">
              <p className="text-xs md:text-sm uppercase font-medium leading-relaxed">
                Designer & Researcher
                <br className="hidden md:block" />
                Aotearoa New&nbsp;Zealand
              </p>
            </div> */}

            <div className="col-span-12 md:col-span-8 pt-8 md:pt-10 border-t border-black/20">
              <p className="text-sm md:text-base leading-relaxed">
                This portfolio explores design, research and systems through a modernist lens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


