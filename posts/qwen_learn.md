---
title: 'Building a Personal Medical Knowledge Base with Qwen2.5 + AnythingLLM'
date: '2025-12-20'
excerpt: 'Using the right method to do the right things may be one of the few reliable sources of stability for an ordinary person trying to live well.'
tags: ['thinking']
---

## Building a Personal Medical Knowledge Base with Qwen2.5 + AnythingLLM

I’m using **Qwen2.5 + AnythingLLM** to build my own medical knowledge base.

Today is **2025-12-20**. There’s nothing special about it. I woke up from a few nightmares and only then realized it was the day of the graduate entrance exam—something that has nothing to do with me anymore. As a bonded medical student, many people around me assumed I would take the exam. For a long time, I assumed so too. But gradually I let that idea go. Maybe returning home is my true destination. I used to want to escape that place with everything I had; now I’m realizing I may have no choice but to go back.

During these years of studying, I’ve tried to find small pleasures outside of coursework—little things to occupy my life. In truth, they were just my way of resisting the monotony of medical education. As long as you keep moving forward, that urge to break out of your boundaries will eventually push you somewhere you want to go. But for most ordinary people, simply living a stable life already takes everything they’ve got. Beyond that—what more is there to demand?

Standing at the end of 2025, I want to leave something behind. Looking back, the things that kept me company the most were various **LLMs**. So this piece is, in a way, dedicated to them.

For anyone following the tech world—especially AI—this year has been full of rewards. OpenAI was founded in 2015, and after a decade, ChatGPT has become one of the most general-purpose AI assistants we’ve ever had. The wave is still rising, and we’re not in an AGI era yet. Even though AI made major leaps as early as 2023, I didn’t really start using domestic AI assistants until 2024. Back then, I only used them for chatting and simple image generation. But just a few months later, LLMs—both inside and outside China—broke into mainstream attention. Then the narrative shifted quickly from “reasoning models” to **AI agents** that can autonomously handle tedious tasks.

In a moment where top tech companies are fighting for market share in the agent era, people like me can only play around with open-source models, call APIs, and build little tools that are practical for our own lives. Even then, I can still feel how far behind I am. **Qwen2.5:7B**, Alibaba’s open-source model, is among the strongest in the 7B-parameter class. What startled me was realizing it was released last year, with its last updates also staying in last year—while Qwen has already moved on to the 3.x series. Sometimes I think my information sources are simply too slow.

I’ve wanted to build my own medical knowledge base for a long time, but never found the right moment to actually do it. Most of it stayed as ideas. Yesterday, with a free afternoon, I finally tried. I downloaded **qwen2.5:7b** through **Ollama**—a 4.7GB file that took roughly two hours, restarting a few times. Later I asked Gemini and learned Ollama supports resume downloads; after stopping it with **Ctrl+C** and restarting twice, it finally completed.

After that, everything went surprisingly smoothly—almost “foolproof.” It made me reflect on how much modern UI tools plus AI assistance have lowered the barrier to doing things. It’s increasingly becoming: if you’re willing to get your hands dirty, you can probably make it work.

Then I fed my latest textbook—**Diagnostics (10th Edition)**, around **600 pages**—into a local embedding model (**nomic-embed-text**). Within minutes, it was chunked and indexed. I used to think vectorization was something inherently difficult, but on a MacBook Air **M2**, the whole thing took less than three minutes, producing tens of thousands of vectors stored locally.

Once the pipeline was built, I started testing and tuning. The results, honestly, were worse than I expected—unstable answers, imperfect citations, and moments where it felt like the model had “seen” the content without truly “understanding” it. Still, I told myself: this is version one. If I keep iterating, the knowledge base will get better.

In an era where the cost of experimentation is so low, a laptop, an AI assistant, and a single afternoon can move a project forward significantly. Yet when I look around, many people still dislike using computers. In the past, building a PC felt like something only specialists did. But with Doubao’s help, my roommate assembled a desktop machine, and even installed Windows 11 from a USB drive I had. In earlier years, that might have required reading manuals and watching hours of tutorials. Now it can happen in a single afternoon.

As I’ve done more hands-on projects, I’ve become more convinced of something simple: in today’s world, if you keep building things that are genuinely useful to you, eventually you’ll start building things that are useful to others. And if something is useful to others, it creates value—and money follows value. I’m still struggling in many ways, but I’m confident this direction is right. Using the right method to do the right things may be one of the few reliable sources of stability for an ordinary person trying to live well.
