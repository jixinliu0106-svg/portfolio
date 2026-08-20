"use client";

import { useEffect, useRef, useState } from "react";
import HeroRipple from "./HeroRipple";

const projects = [
  { title: "项目一", type: "品牌视觉 / Campaign", year: "2026", tone: "light" },
  { title: "CAMEL - 欧美", type: "品牌画册 / Campaign部分案例展示", year: "2025", tone: "dark" },
  { title: "项目三", type: "品牌策略 / Art Direction", year: "2025", tone: "soft" },
  { title: "项目四", type: "内容视觉 / Social Campaign", year: "2024", tone: "red" },
  { title: "项目五", type: "AI 创意生产 / Visual System", year: "2024", tone: "warm" },
  { title: "项目六", type: "数字体验 / E-commerce", year: "2024", tone: "grey" },
];

const camelPages = Array.from({ length: 25 }, (_, index) => index + 1);
const carbonListingImages = Array.from(
  { length: 9 },
  (_, index) => `/projects/carbon-5k/listing-${String(index + 1).padStart(2, "0")}.jpg`,
);
const carbonDetailImages = Array.from(
  { length: 24 },
  (_, index) => `/projects/carbon-5k/detail-${String(index + 1).padStart(2, "0")}.jpg`,
);
const silverListingImages = Array.from(
  { length: 8 },
  (_, index) => `/projects/silver-moon/listing-${String(index + 1).padStart(2, "0")}.jpg`,
);
const silverDetailImages = Array.from(
  { length: 11 },
  (_, index) => `/projects/silver-moon/detail-${String(index + 1).padStart(2, "0")}.jpg`,
);
const mountainListingImages = Array.from(
  { length: 8 },
  (_, index) => `/projects/mountain-shadow/listing-${String(index + 1).padStart(2, "0")}.jpg`,
);
const mountainDetailImages = Array.from(
  { length: 8 },
  (_, index) => `/projects/mountain-shadow/detail-${String(index + 1).padStart(2, "0")}.jpg`,
);
const socialImages = Array.from(
  { length: 21 },
  (_, index) => `/projects/social/social-${String(index + 1).padStart(2, "0")}.jpg`,
);
const partnershipVideos = Array.from(
  { length: 4 },
  (_, index) => `/projects/partnership/video-${String(index + 1).padStart(2, "0")}.mp4`,
);
const camelEuropeBrandStoryImages = Array.from(
  { length: 6 },
  (_, index) => `/projects/camel-europe/brand-story/${String(index + 1).padStart(2, "0")}.jpg`,
);
const camelEuropeTopeakTechImages = Array.from(
  { length: 5 },
  (_, index) => `/projects/camel-europe/topeak-tech/${String(index + 1).padStart(2, "0")}.jpg`,
);
const camelEuropeGuidelineImages = Array.from(
  { length: 27 },
  (_, index) => `/projects/camel-europe/guidelines/${String(index + 1).padStart(2, "0")}.png`,
);
const camelEuropeStandaloneSiteImages = [
  "/projects/camel-europe/standalone-site/01.jpg",
  "/projects/camel-europe/standalone-site/02.jpg",
];

const camelEuropeAmazonListingImages = Array.from(
  { length: 7 },
  (_, index) => `/projects/camel-europe/amazon-featured/listing-${String(index + 1).padStart(2, "0")}.jpg`,
);

const camelEuropeAmazonDetailImages = [
  "/projects/camel-europe/amazon-featured/detail-01.jpg",
  "/projects/camel-europe/amazon-featured/detail-02.png",
  "/projects/camel-europe/amazon-featured/detail-03.png",
  "/projects/camel-europe/amazon-featured/detail-04.jpg",
  "/projects/camel-europe/amazon-featured/detail-05.png",
  "/projects/camel-europe/amazon-featured/detail-06.jpg",
  "/projects/camel-europe/amazon-featured/detail-07.jpg",
];

const camelEuropeSocialImages = Array.from(
  { length: 27 },
  (_, index) => `/projects/camel-europe/social/${String(index + 1).padStart(2, "0")}.jpg`,
);

const projectWindows = [
  { title: "Camel Crown / 东南亚品牌画册", desc: "品牌画册与guidelines", cover: "/projects/camel-crown/pages/1.jpg", pages: camelPages },
  { title: "主推产品 / Carbon 5K", desc: "listing视觉", cover: "/projects/carbon-5k/listing-02.jpg", pages: [] },
  { title: "主推产品 / Silver Moon", desc: "listing视觉", cover: "/projects/silver-moon/cover.jpg", pages: [] },
  { title: "主推产品 / 山影", desc: "listing视觉", cover: "/projects/mountain-shadow/cover.jpg", pages: [] },
  { title: "社交内容 / Social", desc: "适配社交平台的内容与传播延展", cover: "/projects/social/cover.jpg", pages: [] },
  { title: "合作与传播 / Partnership", desc: "社媒 AI 视频案例", cover: "/projects/partnership-cover.jpg", pages: [] },
];

const placeholderWindows = Array.from({ length: 6 }, (_, index) => ({
  title: index === 0 ? "CAMEL" : index === 1 ? "CAMEL / Guidelines" : index === 2 ? "CAMEL / 独立站" : index === 3 ? "主推产品 / AMZ主推品案例" : index === 4 ? "社媒内容 / SOCIAL" : `案例 ${String(index + 1).padStart(2, "0")}`,
  listingTitle: index === 0 ? "CAMEL / 欧美品牌画册" : index === 1 ? "CAMEL / Guidelines" : index === 2 ? "CAMEL / 独立站" : index === 3 ? "主推产品 / AMZ主推品案例" : index === 4 ? "社媒内容 / SOCIAL" : `案例 ${String(index + 1).padStart(2, "0")}`,
  desc: index === 0 ? "CAMEL CROWN 品牌历史与技术故事" : index === 1 ? "跨境电商guidelines" : index === 2 ? "CAMEL独立站视觉策划、设计" : index === 3 ? "AMZ listing案例" : index === 4 ? "社媒内容视觉策划与设计" : "项目内容待更新",
  cover: index === 0 ? "/projects/camel-europe/cover.jpg" : index === 1 ? "/projects/camel-europe/guidelines/01.png" : index === 2 ? "/projects/camel-europe/standalone-site/cover.jpg" : index === 3 ? "/projects/camel-europe/amazon-featured/cover.jpg" : index === 4 ? "/projects/camel-europe/social/cover.jpg" : null,
}));

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [openSkill, setOpenSkill] = useState<number | null>(null);
  const [openProject, setOpenProject] = useState(false);
  const [activeTopProject, setActiveTopProject] = useState<number | null>(null);
  const [activeWindow, setActiveWindow] = useState<number | null>(null);

  const skillDetails = [
    "长期服务于全球领先企业，主导从 0→1 的品牌形象建立及线上线下一体化视觉系统搭建，涵盖品牌视觉、独立站、电商平台及多媒体内容，具备成熟的团队管理与跨职能协作经验。",
    "曾为多家国际头部品牌提供品牌视觉与创意全案指导，累计完成 10+ 品牌形象系统、5000+ 页响应式电商与营销页面、1000+ 平面视觉作品、近 100 条视频及多媒体内容。部分项目直接推动品牌实现数十亿级销售规模，并多次位列天猫双十一同品类销售榜首。",
    "具备从 0→1 搭建视觉与内容团队的实操经验，能够根据业务规模与平台差异，建立清晰的岗位分工、工作流程与交付标准。",
    "AIGA / American Institute of Graphic Arts 会员，紧跟设计趋势和流行，擅长 AIGC，具备系统的设计理论基础与全球视觉趋势洞察，擅长将国际审美、品牌战略与电商转化有效结合。",
  ];
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let active = false;
    const target = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };

    const render = () => {
      current.x += (target.x - current.x) * 0.11;
      current.y += (target.y - current.y) * 0.11;

      hero.style.setProperty("--pointer-x", `${current.x * 100}%`);
      hero.style.setProperty("--pointer-y", `${current.y * 100}%`);
      hero.style.setProperty("--image-x", `${(current.x - 0.5) * -22}px`);
      hero.style.setProperty("--image-y", `${(current.y - 0.5) * -14}px`);
      hero.style.setProperty("--content-x", `${(current.x - 0.5) * 10}px`);
      hero.style.setProperty("--content-y", `${(current.y - 0.5) * 7}px`);
      if (active || Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
        frame = requestAnimationFrame(render);
      }
    };

    const onMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      target.y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
      if (!active) {
        active = true;
        hero.dataset.active = "true";
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(render);
      }
    };
    const onLeave = () => {
      active = false;
      hero.dataset.active = "false";
      target.x = 0.5;
      target.y = 0.5;
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <main>
      <section ref={heroRef} className="hero">
        <div className="cover-image" />
        <HeroRipple />
        <div className="cover-overlay" />
        <div className="hero-top"><span>RL / 001</span><span>个人作品集<br />2025 — 2026</span><button className="align-right hero-scroll" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>向下浏览 <b>↘</b></button></div>
        <div className="hero-content"><p className="eyebrow">视觉经理 / Visual Director</p><p className="hero-description">以品牌负责人和创意总监的视角，<br />建立面向海外市场的视觉系统、<br />内容策略与 AI 创意生产流程。</p></div>
        <div className="hero-bottom"><span>跨境电商视觉 · 品牌设计 · AI 创意</span><span className="align-right"><b className="status-dot" /> 接受合作项目</span></div>
      </section>

      <section className="intro"><div className="section-label">关于我 / About</div><div className="intro-copy"><h2>让视觉成为<br /><i>品牌的竞争力。</i></h2><div className="intro-details"><p>我是一名跨境电商品牌视觉经理，专注于品牌视觉、电商体系与商业内容。以国际化审美和清晰的系统方法，帮助品牌建立长期可复用的视觉资产。</p><ol>{skillDetails.map((detail, index) => <li className={openSkill === index ? "is-open" : ""} key={detail}><button onClick={() => setOpenSkill(openSkill === index ? null : index)}><b>0{index + 1}</b><span>{["超 10 年品牌视觉与电商体系搭建经验", "丰富的品牌全案与商业转化成果", "团队管理与 SOP 体系搭建能力", "国际化审美与趋势判断能力"][index]}</span><em>+</em></button><div className="skill-detail">{detail}</div></li>)}</ol></div></div></section>

      <section className="work" id="work"><div className="section-heading"><div className="section-label">精选项目 / Selected Work</div><p>点击项目封面查看完成案例<br />*CAMELCROWN、CAMEL案例图片/视频均是AI生成</p></div><div className="project-grid">{projects.map((project, index) => <article className={`project project-${index + 1}`} key={project.title}><button className={`project-placeholder ${project.tone} ${index < 2 ? "has-image" : ""}`} onClick={() => { if (index < 5) { setActiveTopProject(index); setActiveWindow(null); setOpenProject(true); } }}>{index === 0 ? <img src="/projects/camel-crown/cover.png" alt="Camel Crown 品牌画册封面" /> : index === 1 ? <img src="/projects/camel-europe-cover.jpg" alt="CAMEL 欧美项目封面" /> : <span>PROJECT 0{index + 1}</span>}<span className="placeholder-mark">+</span></button><div className="project-info"><div><h3>{index === 0 ? "Camel Crown - 东南亚" : project.title}</h3><p>{index === 0 ? "品牌画册 / Campaign部分案例展示" : project.type}</p></div><span>{project.year}</span></div></article>)}</div></section>

      {openProject && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-label={`${activeTopProject === 0 ? "Camel Crown - 东南亚" : activeTopProject !== null ? projects[activeTopProject].title : "项目"}预览`}>
          <div className="project-modal-inner">
            <div className="modal-top">
              <span>{activeWindow === null ? (activeTopProject === 0 ? "Camel Crown / Brand Book 2026" : `${activeTopProject !== null ? projects[activeTopProject].title : "项目"} / CASE STUDIES`) : (activeTopProject === 0 ? `${projectWindows[activeWindow].title} / CAMEL CROWN` : `${placeholderWindows[activeWindow].title} / ${activeTopProject !== null ? projects[activeTopProject].title : "项目"}`)}</span>
              <button onClick={() => { setOpenProject(false); setActiveWindow(null); setActiveTopProject(null); }}>关闭 ×</button>
            </div>
            {activeWindow === null ? (
              <>
                <p className="modal-intro">{activeTopProject === 0 ? "东南亚运动生活方式品牌视觉项目。选择一个作品窗口进入完整内容预览。" : activeTopProject === 1 ? "CAMEL欧美市场品牌定位：一个以性能为基础、以耐用为核心的户外品牌，专注真实环境下的防护力、功能性与性价比，服务更广泛的户外人群。" : "选择一个项目进入三级作品展示。"}</p>
                <div className="project-windows">
                  {activeTopProject === 0 ? projectWindows.map((item, index) => (
                      <button className="project-window" key={item.title} onClick={() => setActiveWindow(index)}>
                        <img src={item.cover} alt={item.title} />
                        <div className="project-window-info">
                          <span>0{index + 1} / {item.title}</span>
                          <small>{item.desc}</small>
                          <b>↗</b>
                        </div>
                      </button>
                    )) : placeholderWindows.map((item, index) => (
                      <button className="project-window placeholder-project-window" key={item.title} onClick={() => setActiveWindow(index)}>
                        {activeTopProject === 1 && item.cover ? (
                          <img src={item.cover} alt={`${item.listingTitle} 封面`} />
                        ) : (
                          <div className={`project-window-placeholder project-tone-${activeTopProject ?? 0}`}><span>PROJECT {String(index + 1).padStart(2, "0")}</span></div>
                        )}
                        <div className="project-window-info">
                          <span>0{index + 1} / {item.listingTitle}</span>
                          <small>{item.desc}</small>
                          <b>↗</b>
                        </div>
                      </button>
                    ))}
                </div>
              </>
            ) : (
              <>
                <button className="modal-back" onClick={() => setActiveWindow(null)}>← 返回作品目录</button>
                {activeTopProject === 1 && activeWindow === 0 ? (
                  <div className="brand-story-pages">
                    {[...camelEuropeBrandStoryImages, ...camelEuropeTopeakTechImages].map((src, index) => (
                      <img key={src} src={src} alt={`CAMEL 欧美案例 ${index + 1}`} loading={index < 2 ? "eager" : "lazy"} />
                    ))}
                  </div>
                ) : activeTopProject === 1 && activeWindow === 1 ? (
                  <>
                    <p className="modal-intro">CAMEL CROWN 跨境电商视觉规范，涵盖品牌标志、字体、辅助图形、色彩系统，以及 Amazon、SHEIN、OZON、Walmart 等平台的主图与 A+ 页面应用标准。</p>
                    <div className="brand-story-pages">
                      {camelEuropeGuidelineImages.map((src, index) => (
                        <img key={src} src={src} alt={`CAMEL 跨境电商视觉规范 ${index + 1}`} loading={index < 2 ? "eager" : "lazy"} />
                      ))}
                    </div>
                  </>
                ) : activeTopProject === 1 && activeWindow === 2 ? (
                  <>
                    <p className="modal-intro"><a href="https://cameloutdoorus.com/" target="_blank" rel="noreferrer">CAMEL 欧美独立站视觉策划与设计，以 TOPEAK TECH 技术体系为核心，完成首页信息架构、产品功能展示、内容营销、运动员故事与品牌历史等模块，建立兼顾专业性能、品牌表达与电商转化的完整购物体验。 ↗</a></p>
                    <div className="standalone-site-pages">
                      {camelEuropeStandaloneSiteImages.map((src, index) => (
                        <img key={src} src={src} alt={`CAMEL 独立站设计 ${index + 1}`} loading="eager" />
                      ))}
                    </div>
                  </>
                ) : activeTopProject === 1 && activeWindow === 3 ? (
                  <>
                    <p className="modal-intro">
                      <a href="https://www.amazon.com/dp/B07FTBNKWS" target="_blank" rel="noreferrer">
                        CAMEL CROWN Amazon 主推产品 Listing 与 A+ 页面视觉策划，以女性三合一户外夹克为核心，系统呈现保暖防风、防水、耐磨、多场景穿着、产品细节与尺码信息，兼顾技术卖点传达、品牌氛围与电商转化。 ↗
                      </a>
                    </p>
                    <div className="amazon-listing-grid">
                      {camelEuropeAmazonListingImages.map((src, index) => (
                        <img key={src} src={src} alt={`CAMEL CROWN Amazon Listing ${index + 1}`} loading={index < 4 ? "eager" : "lazy"} />
                      ))}
                    </div>
                    <div className="amazon-detail-pages">
                      {camelEuropeAmazonDetailImages.map((src, index) => (
                        <img key={src} src={src} alt={`CAMEL CROWN Amazon A+ ${index + 1}`} loading="lazy" />
                      ))}
                    </div>
                  </>
                ) : activeTopProject === 1 && activeWindow === 4 ? (
                  <>
                    <p className="modal-intro">
                      <a
                        href="https://www.instagram.com/cameloutdoorus/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        CAMEL 欧美社媒内容视觉策划与设计，围绕新品推广、技术面料、户外场景、互动活动与生活方式内容，构建兼顾产品卖点、品牌调性与用户参与的社交传播体系。查看 Instagram ↗
                      </a>
                    </p>
                    <div className="social-grid">
                      {camelEuropeSocialImages.map((src, index) => (
                        <img
                          key={src}
                          src={src}
                          alt={`CAMEL 欧美社媒视觉 ${String(index + 1).padStart(2, "0")}`}
                          loading={index < 6 ? "eager" : "lazy"}
                        />
                      ))}
                    </div>
                  </>
                ) : activeTopProject !== 0 ? (
                  <>
                    <p className="modal-intro">案例内容待更新</p>
                    <div className="tertiary-placeholder">
                      <span>{placeholderWindows[activeWindow].title}</span>
                      <small>作品图片与内容将在后续更新</small>
                    </div>
                  </>
                ) : activeWindow === 1 ? (
                  <>
                    <p className="modal-intro"><a href="http://shopee.ph/product/264048497/25839879611/" target="_blank" rel="noreferrer">Carbon 5K listing视觉 ↗</a></p>
                    <div className="carbon-listing-grid">
                      {carbonListingImages.map((src, index) => (
                        <img key={src} src={src} alt={`Carbon 5K 橱窗图 ${index + 1}`} loading={index < 4 ? "eager" : "lazy"} />
                      ))}
                    </div>
                    <div className="carbon-detail-pages">
                      {carbonDetailImages.map((src, index) => (
                        <img key={src} src={src} alt={`Carbon 5K 详情图 ${index + 1}`} loading="lazy" />
                      ))}
                    </div>
                  </>
                ) : activeWindow === 2 ? (
                  <>
                    <p className="modal-intro"><a href="https://shopee.ph/product/264048497/25839879611/" target="_blank" rel="noreferrer">Silver Moon listing视觉 ↗</a></p>
                    <div className="silver-listing-grid">
                      {silverListingImages.map((src, index) => (
                        <img key={src} src={src} alt={`Silver Moon 橱窗图 ${index + 1}`} loading={index < 4 ? "eager" : "lazy"} />
                      ))}
                    </div>
                    <div className="silver-detail-pages">
                      {silverDetailImages.map((src, index) => (
                        <img key={src} src={src} alt={`Silver Moon 详情图 ${index + 1}`} loading="lazy" />
                      ))}
                    </div>
                  </>
                ) : activeWindow === 3 ? (
                  <>
                    <p className="modal-intro"><a href="http://shopee.ph/product/264048497/56155758804/" target="_blank" rel="noreferrer">Mountain Shadow listing视觉 ↗</a></p>
                    <div className="mountain-listing-grid">
                      {mountainListingImages.map((src, index) => (
                        <img key={src} src={src} alt={`Mountain Shadow 橱窗图 ${index + 1}`} loading={index < 4 ? "eager" : "lazy"} />
                      ))}
                    </div>
                    <div className="mountain-detail-pages">
                      {mountainDetailImages.map((src, index) => (
                        <img key={src} src={src} alt={`Mountain Shadow 详情图 ${index + 1}`} loading="lazy" />
                      ))}
                    </div>
                  </>
                ) : activeWindow === 4 ? (
                  <>
                    <p className="modal-intro"><a href="https://www.facebook.com/CamelCrownPH" target="_blank" rel="noreferrer">Social Media Content案例展示 ↗</a></p>
                    <div className="social-grid">
                      {socialImages.map((src, index) => (
                        <img key={src} src={src} alt={`Camel Crown 社媒视觉 ${index + 1}`} loading={index < 6 ? "eager" : "lazy"} />
                      ))}
                    </div>
                  </>
                ) : activeWindow === 5 ? (
                  <>
                    <p className="modal-intro"><a href="https://www.facebook.com/CamelCrownPH" target="_blank" rel="noreferrer">社媒AI视频案例展示 ↗</a></p>
                    {partnershipVideos.length > 0 ? (
                      <div className="partnership-video-grid">
                        {partnershipVideos.map((src, index) => (
                          <video key={src} src={src} aria-label={`社媒 AI 视频案例 ${index + 1}`} playsInline controls muted preload="metadata" />
                        ))}
                      </div>
                    ) : (
                      <p className="partnership-empty">视频案例待上传</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="modal-intro">
                      {projectWindows[activeWindow].desc} · 第 {projectWindows[activeWindow].pages[0]}—{projectWindows[activeWindow].pages.at(-1)} 页
                    </p>
                    <div className="lookbook-pages">
                      {projectWindows[activeWindow].pages.map((page, index) => (
                        <figure className="lookbook-page" key={page}>
                          <img src={`/projects/camel-crown/pages/${page}.jpg`} alt={`Camel Crown ${projectWindows[activeWindow].title} 第 ${page} 页`} loading={index < 2 ? "eager" : "lazy"} />
                          <figcaption>{String(page).padStart(2, "0")} / CAMEL CROWN</figcaption>
                        </figure>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <footer className="footer"><div className="section-label">联系我 / Contact</div><a href="mailto:jixinliu0106@gmail.com">jixinliu0106<br /><i>@gmail.com</i> <span>↗</span></a><div className="footer-bottom"><span>Rocky Liu © 2025</span><span>邮箱 / jixinliu0106@gmail.com</span><span><a className="social-link" href="https://www.instagram.com/stone.x.x/" target="_blank" rel="noreferrer">Instagram / stone.x.x ↗</a></span></div></footer>
    </main>
  );
}
