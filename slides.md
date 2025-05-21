---
theme: apple-basic
background: https://cover.sli.dev
title: Multi-Agents System
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
colorSchema: light

# HTML tag attributes
htmlAttrs:
  dir: ltr
  lang: en
  data-theme: light

layout: intro-image
image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Amoeba_proteus_locomotive_form.jpg/2560px-Amoeba_proteus_locomotive_form.jpg'
---

<div class="absolute top-10 text-black text-left">
  <span class="font-700">
    Antoine Sutter & Tanguy Cavagna
    <br />
    May 23, 2025
  </span>
</div>

<div class="absolute bottom-10 text-black text-left">
  <h1>Multi-Agents System</h1>
  <p>How collective intelligence emerges from individual behaviors</p>
</div>

<div class="abs-br m-6 text-black text-xs">
  Image by <a href="//commons.wikimedia.org/wiki/User:SmallRex" title="User:SmallRex">SmallRex</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/4.0" title="Creative Commons Attribution-Share Alike 4.0">CC BY-SA 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=99796204">Link</a>
</div>

---
level: 2
---

# Introduction

<div class="mb-12"></div>

## What Are Multi-Agent Systems (MAS)?

- A collection of <span v-mark.highlight.red="1">automonous</span>, <span v-mark.highlight.red="1">interacting</span> agents placed in a shared environment.
- Each agent <span v-mark.highlight.yellow="2">perceive</span>, <span v-mark.highlight.yellow="2">reason</span>, <span v-mark.highlight.yellow="2">act</span>, and sometimes <span v-mark.udnerline.yellow="3">communicate</span> with others.
- Emergent behavior exhibition from local interactions.

## Why Are MAS Important?

- They model <span v-mark.highlight.green="4">distributed</span>, <span v-mark.highlight.green="4">decentralized</span> systems that are <span v-mark.highlight.green="4">scalable</span> and <span v-mark.highlight.green="4">robust</span>.
- Inspired by <span v-mark.highlight.purple="5">physical</span> and <span v-mark.highlight.purple="5">biological</span> systems and applied to various fields.

---

# Abstract Modeling
*Simple reflex agent*

<img class="mx-auto" width="60%" src="./images/reflex-agent.png" alt="" />
<div class="text-center text-xs mt-2">Diagram taken from wikipedia - "Multi-agent system", redrawn by us.</div>

---

# Mathematical Modeling

<v-click hide>
Fromally, a MAS can be defined as:

$$
MAS = \langle A, E, I, \gamma \rangle
$$

where:
- $A = \{a_1, a_2, \dots, a_n\}$ is a finite set of agents
- $E$ represents the environment
- $I = \{i_1, i_2, \dots, i_n\}$ is a set of interaction
- $\gamma : A \times E \times I \rightarrow A \times E$ is a transition function
</v-click>

<v-click at="1">
awdawd
</v-click>

---
transition: null
---

<div v-click> Visible after 1 click </div>
<div v-click.hide> Hidden after 2 clicks </div>
<div v-after.hide> Hidden after 2 clicks </div>


---

<BacteriaPlot />
