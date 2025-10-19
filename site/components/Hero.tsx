export default function Hero() {
  return (
    <section className="bg-white text-black selection:bg-black selection:text-white py-10 md:py-16">
      <div className="site-grid">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-[var(--gutter)] py-10 md:py-16">
            <div className="col-span-12 flex items-center justify-between text-xs md:text-sm uppercase tracking-widest font-medium">
              <span>Ethan Sheaf‑Morrison</span>
              <span className="hidden md:block">Design · Research · Aotearoa</span>
            </div>

            <div className="col-span-12 md:col-span-9">
              <h1 className="font-black uppercase leading-[0.82] tracking-[-0.04em] text-[16vw] md:text-[9rem]">
                Kia ora, I&#39;m Ethan
              </h1>
            </div>

            <div className="col-span-12 md:col-span-3 md:pl-6 flex md:block items-end">
              <p className="text-xs md:text-sm uppercase font-medium leading-relaxed">
                Designer & Researcher
                <br className="hidden md:block" />
                Aotearoa New&nbsp;Zealand
              </p>
            </div>

            <div className="col-span-12 md:col-span-8 pt-4 md:pt-6">
              <p className="text-sm md:text-base leading-relaxed">
                I&#39;m a designer and researcher based in Aotearoa New Zealand. My practice blends
                indigenous storytelling, critical cartography, and digital systems thinking to
                reimagine how we visualise land, data, and identity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


