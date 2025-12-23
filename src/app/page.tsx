'use client';

import { useState, useRef, useEffect } from "react";
import { Press_Start_2P } from 'next/font/google';
import React from "react";
import Image from "next/image";

const COLOR_BG = "#141c1c"; // (20, 28, 28)
const COLOR_PRIMARY = "#938dc7"; // (147, 141, 199)
const COLOR_ACCENT = "#bd6986"; // (189, 105, 134)
const COLOR_TEXT = "#e5e7eb"; // Tailwind gray-200 for contrast
const COLOR_DIM = "#636675"; // (99, 102, 117)

const resume = {
  education: [
    'Columbia University',
    '  - Masters of Science in Applied Analytics (May 2024)',
    'New York University, Leonard N. Stern School of Business',
    '  - Bachelor of Science, Finance & Data Science (Dec 2019)'
  ],
  experience: [
    'IBM',
    '  Senior Product Manager, watsonx.ai Foundation Models (May 2024 – Present): Led product strategy, model launches, and AI gateway development for watsonx.ai.',
    '',
    '  Business Operations & Strategy Manager (Apr 2022 – Dec 2022): Developed business cases, dashboards, and portfolio strategies for IBM’s Data and AI division.',
    '',
    '  Senior Business Operations & Strategy Associate (Jun 2021 – Mar 2022): Built analytics tools and staffing models to optimize product management and sales.',
    '',
    '  Business Operations & Strategy Associate (Jan 2020 – May 2021): Redesigned analytics dashboards and developed performance metrics for IBM portfolios.',
    '',
    '  Data Scientist Intern (Jun 2019 – Aug 2019): Built predictive models and performed data analysis for client revenue and workforce insights.',
    '',
    'WeaveGrid - Series B EV Charging Startup',
    '  Master’s Summer Intern (May 2023 – Aug 2023): Researched and built reporting tools and compliance metrics for utility EV charging programs.',
    '',
    'SeaStraws',
    '  Co-Founder & Chief Strategy Officer (May 2018 – Jan 2020): Built supply chain, raised funding, and led go-to-market strategy for sustainable products.'
  ],
  skills: 'Python, SQL, R, Excel, Tableau/Mode/Looker, Figma, Spark, Neo4j, MongoDB, dbt',
  about: [
    'I’m passionate about building anything and all from the ground up,',
    'and solving strategic problems through data and AI.',
    'I’m eager to learn about and become further involved in this little segment',
    'of world history marked by rapid technological transformation :)'
  ],
  help: `Available commands:\nabout, education, experience, skills, ideas, contact, clear, help`
};

// Blog/ideas section (simple in-memory for now)
const BLOG_ENTRIES: { title: string; content: string }[] = [];

const BLOG_ADMIN_PASSWORD = "Ni$arg11235";

function TerminalLine({ children, color = COLOR_TEXT }: { children: React.ReactNode; color?: string }) {
  return <div style={{ color }}>{children}</div>;
}

const pixelFont = Press_Start_2P({ subsets: ['latin'], weight: '400' });

const STARTUP_LINES = [
  <TerminalLine key="startup" color={COLOR_PRIMARY}>
    <span className={pixelFont.className + " text-5xl sm:text-7xl drop-shadow-lg"} style={{ letterSpacing: 2, color: COLOR_PRIMARY, textShadow: `2px 2px 0 ${COLOR_ACCENT}, 4px 4px 0 ${COLOR_BG}` }}>
      NISARG PATEL
    </span>
  </TerminalLine>,
  <TerminalLine key="subheader" color={COLOR_ACCENT}>
    <span className={pixelFont.className + " text-xs sm:text-sm mt-1 block"} style={{ letterSpacing: 1, color: COLOR_ACCENT }}>
      Optimist | Lifelong Learner | Always Asking Questions
    </span>
  </TerminalLine>,
  <TerminalLine key="welcome" color={COLOR_DIM}>
    Type <span style={{ color: COLOR_ACCENT }}>help</span> to get started.
  </TerminalLine>
];

// Remove ship animation state and logic, add rocket animation state
const ROCKET_WIDTH = 64;
const ROCKET_HEIGHT = 128;

export default function Home() {
  const [lines, setLines] = useState(STARTUP_LINES);
  const [input, setInput] = useState("");
  const [contactMode, setContactMode] = useState<false | 'email' | 'message'>(false);
  const [contactEmail, setContactEmail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const [blogEntries, setBlogEntries] = useState(BLOG_ENTRIES);
  const [blogMode, setBlogMode] = useState<false | 'password' | 'entry'>(false);
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });

  // Animation state for rocket (bottom to top)
  const [rocketY, setRocketY] = useState(0); // Will be set in useEffect
  useEffect(() => {
    setRocketY(window.innerHeight);
  }, []);
  useEffect(() => {
    let running = true;
    function animate() {
      setRocketY(y => {
        let next = y - 2.2;
        if (next < -ROCKET_HEIGHT) next = window.innerHeight;
        return next;
      });
      if (running) requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lines]);

  // Starfield animation effect
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const STAR_COLORS = [COLOR_PRIMARY, COLOR_ACCENT, "#fff", COLOR_DIM];
    const STAR_COUNT = Math.floor((width * height) / 1800);
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.5,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      speed: Math.random() * 0.7 + 0.3
    }));

    let animationId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        // Move diagonally (down-right)
        star.x += star.speed;
        star.y += star.speed * 0.7;
        // Wrap around
        if (star.x > width) star.x = 0;
        if (star.y > height) star.y = 0;
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const renderLines = (lines: string[]) => lines.map((line, i) => <TerminalLine key={i}>{line}</TerminalLine>);

  const handleCommand = (cmd: string) => {
    let output: string | string[] | React.ReactNode | undefined = undefined;
    const command = cmd.trim();
    // Blog/ideas admin flow
    if (blogMode === 'password') {
      if (command === BLOG_ADMIN_PASSWORD) {
        setLines(prev => [
          ...prev,
          <TerminalLine key={prev.length + 'blog-auth'} color={COLOR_ACCENT}>Password accepted. Enter blog title (or type &apos;cancel&apos;):</TerminalLine>
        ]);
        setBlogMode('entry');
        return;
      } else if (command.toLowerCase() === 'cancel') {
        setLines(prev => [
          ...prev,
          <TerminalLine key={prev.length + 'blog-cancel'} color={COLOR_DIM}>Blog entry cancelled.</TerminalLine>
        ]);
        setBlogMode(false);
        setNewBlog({ title: '', content: '' });
        return;
      } else {
        setLines(prev => [
          ...prev,
          <TerminalLine key={prev.length + 'blog-auth-fail'} color={COLOR_ACCENT}>Incorrect password. Type &apos;ideas&apos; to try again.</TerminalLine>
        ]);
        setBlogMode(false);
        return;
      }
    }
    if (blogMode === 'entry') {
      if (command.toLowerCase() === 'cancel') {
        setLines(prev => [
          ...prev,
          <TerminalLine key={prev.length + 'blog-cancel'} color={COLOR_DIM}>Blog entry cancelled.</TerminalLine>
        ]);
        setBlogMode(false);
        setNewBlog({ title: '', content: '' });
        return;
      }
      if (!newBlog.title) {
        setNewBlog({ ...newBlog, title: command });
        setLines(prev => [
          ...prev,
          <TerminalLine key={prev.length + 'blog-title'} color={COLOR_ACCENT}>Title set. Enter blog content (or type &apos;cancel&apos;):</TerminalLine>
        ]);
        return;
      } else {
        setBlogEntries(prev => [...prev, { title: newBlog.title, content: command }]);
        setLines(prev => [
          ...prev,
          <TerminalLine key={prev.length + 'blog-added'} color={COLOR_ACCENT}>Blog entry added! Type &apos;ideas&apos; to view.</TerminalLine>
        ]);
        setBlogMode(false);
        setNewBlog({ title: '', content: '' });
        return;
      }
    }
    if (command.toLowerCase() === 'ideas') {
      setLines(prev => [
        ...prev,
        <TerminalLine key={prev.length + 'blog-header'} color={COLOR_PRIMARY}><span className="font-mono">--- Blog Entries ---</span></TerminalLine>,
        ...blogEntries.map((entry, i) => [
          <TerminalLine key={prev.length + 'blog-title-' + i} color={COLOR_ACCENT}>
            <span className="font-mono font-bold text-lg">{entry.title}</span>
          </TerminalLine>,
          <TerminalLine key={prev.length + 'blog-content-' + i}><span className="font-mono">{entry.content}</span></TerminalLine>,
          <TerminalLine key={prev.length + 'blog-split-' + i} color={COLOR_DIM}><span className="font-mono">{'='.repeat(40)}</span></TerminalLine>
        ]).flat(),
        <TerminalLine key={prev.length + 'blog-edit'} color={COLOR_DIM}>Type &apos;ideas admin&apos; to add a new entry (owner only).</TerminalLine>
      ]);
      return;
    }
    if (command.toLowerCase() === 'ideas admin') {
      setLines(prev => [
        ...prev,
        <TerminalLine key={prev.length + 'blog-pw'} color={COLOR_ACCENT}>Enter admin password (or type &apos;cancel&apos;):</TerminalLine>
      ]);
      setBlogMode('password');
      return;
    }
    if (contactMode === 'email') {
      setContactEmail(command);
      setLines(prev => [
        ...prev,
        <TerminalLine key={prev.length + "contact-email"} color={COLOR_PRIMARY}>
          <span className="font-mono">$ {cmd}</span>
        </TerminalLine>,
        <TerminalLine key={prev.length + "contact-msg-prompt"} color={COLOR_ACCENT}>
          Please enter your message and press Enter:
        </TerminalLine>
      ]);
      setContactMode('message');
      return;
    }
    if (contactMode === 'message') {
      // Send email via mailto with user email and message
      const mailto = `mailto:nisarg.r.patel98@gmail.com?subject=Contact%20from%20Terminal&body=From:%20${encodeURIComponent(contactEmail)}%0A%0A${encodeURIComponent(command)}`;
      window.open(mailto, '_blank');
      setLines(prev => [
        ...prev,
        <TerminalLine key={prev.length + "contact-msg"} color={COLOR_PRIMARY}>
          <span className="font-mono">$ {cmd}</span>
        </TerminalLine>,
        <TerminalLine key={prev.length + "contact-confirm"} color={COLOR_ACCENT}>
          Message sent! Your email client should have opened.<br/>Type <span style={{ color: COLOR_ACCENT }}>help</span> for more commands.
        </TerminalLine>
      ]);
      setContactMode(false);
      setContactEmail("");
      return;
    }
    const lower = command.toLowerCase();
    if (lower === "help") output = resume.help;
    else if (lower === "about") output = renderLines(resume.about);
    else if (lower === "education") output = renderLines(resume.education);
    else if (lower === "experience") output = renderLines(resume.experience);
    else if (lower === "skills") output = resume.skills;
    else if (lower === "contact") {
      setLines(prev => [
        ...prev,
        <TerminalLine key={prev.length + "contact-email-prompt"} color={COLOR_ACCENT}>
          Please enter your email address and press Enter:
        </TerminalLine>
      ]);
      setContactMode('email');
      return;
    }
    else if (lower === "clear") {
      setLines(STARTUP_LINES);
      setContactMode(false);
      setContactEmail("");
      return;
    } else if (command) output = `Command not found: ${command}`;
    if (output)
      setLines((prev) => [
        ...prev,
        <TerminalLine key={prev.length + "cmd"} color={COLOR_PRIMARY}>
          <span className="font-mono">$ {cmd}</span>
        </TerminalLine>,
        <TerminalLine key={prev.length + "out"}>{output}</TerminalLine>
      ]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ background: COLOR_BG }}>
      {/* Starfield background */}
      <canvas ref={starCanvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />
      {/* Rocket moving bottom to top on left */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{ left: 24, top: rocketY, width: ROCKET_WIDTH, height: ROCKET_HEIGHT, transition: 'none' }}
        id="rocket-bg"
      >
        <Image src="/rocket.png" alt="Rocket" width={ROCKET_WIDTH} height={ROCKET_HEIGHT} style={{ imageRendering: 'pixelated' }} />
      </div>
      <div className="relative w-full max-w-3xl rounded-lg shadow-lg p-4 sm:p-8 z-10" style={{ background: COLOR_BG, border: `1.5px solid ${COLOR_DIM}` }}>
        <div
          className="h-[60vh] overflow-y-auto font-mono text-base mb-2 px-1"
          style={{ color: COLOR_TEXT }}
        >
          {lines}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span style={{ color: COLOR_ACCENT }} className="font-mono">$</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none border-none font-mono text-base"
            style={{ color: COLOR_TEXT }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
          />
        </form>
      </div>
    </div>
  );
}
