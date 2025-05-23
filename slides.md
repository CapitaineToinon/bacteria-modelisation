---
theme: seriph
title: Multi-Agents System
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
  class: "[p]:text-black"

# layout: intro-image
background: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Amoeba_proteus_locomotive_form.jpg/2560px-Amoeba_proteus_locomotive_form.jpg'
---

<div class="absolute top-10 text-white text-left">
  <span class="font-700">
    Antoine Sutter & Tanguy Cavagna
    <br />
    May 23, 2025
  </span>
</div>

<div class="absolute bottom-10 text-white text-left">
  <h1>Multi-Agents System</h1>
  <p>How collective intelligence emerges from individual behaviors</p>
    <a href="https://bacteria.capitainetoinon.ch/simulation" target="__blank">
        bacteria.capitainetoinon.ch
    </a>
</div>

<div class="abs-br m-6 text-white text-xs">
  Image by <a href="//commons.wikimedia.org/wiki/User:SmallRex" title="User:SmallRex">SmallRex</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/4.0" title="Creative Commons Attribution-Share Alike 4.0">CC BY-SA 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=99796204">Link</a>
</div>

---
transition: slide-left
---

# Introduction

<div class="mb-12"></div>

## What Are Multi-Agent Systems (MAS)?

- A collection of <span v-mark.highlight.red="1">automonous</span>, <span v-mark.highlight.red="1">interacting</span> agents placed in a shared environment.
- Each agent <span v-mark.highlight.blue="2">perceive</span>, <span v-mark.highlight.blue="2">reason</span>, <span v-mark.highlight.blue="2">act</span>, and sometimes <span v-mark.underline.blue="3">communicate</span> with others.
- Emergent behavior exhibition from local interactions.

## Why Are MAS Important?

- They model <span v-mark.highlight.green="4">distributed</span>, <span v-mark.highlight.green="4">decentralized</span> systems that are <span v-mark.highlight.green="4">scalable</span> and <span v-mark.highlight.green="4">robust</span>.
- Inspired by <span v-mark.highlight.purple="5">physical</span> and <span v-mark.highlight.purple="5">biological</span> systems and applied to various fields.

<Arrow v-click.at="3" x1="590" y1="275" x2="540" y2="240" color="#60a5fa" />
<p v-click.at="3" class="absolute bottom-62 right-25 transform text-[#60a5fa]">Like stigmergy, repulsion/attraction</p>

---
transition: none
---

# Mathematical Modeling

Each agent $a_i \in A$ is typically modeled as:

$$
  a_i = \langle S_i, P_i, Act_i, \delta_i \rangle
$$

<v-click at="1">
where:
</v-click>

<v-clicks>

- $S_i$ is the set of internal states
- $P_i$ is the perception function mapping environment states to perceived information
- $Act_i$ is the set of possible actions
- $I = \{i_1, i_2, \dots, i_n\}$ is a set of possible interaction
- $\delta_i: S_i \times P_i(E) \times I \rightarrow \alpha_i \in Act_i$ is the decision function <span v-mark.highlight.red.at="6">(micro/agent level)</span>

</v-clicks>

---
transition: none
---

# Mathematical Modeling

Fromally, a $MAS$ can be defined as:

$$
MAS = \langle A, E, I, \gamma \rangle
$$

<v-click at="1">
where:
</v-click>

<v-clicks>

- $A = \{a_1, a_2, \dots, a_n\}$ is a finite set of agents
- $E$ represents the environment
- $\gamma : \boldsymbol{\alpha}^t \times E^t \times I \rightarrow A^{t+1} \times E^{t+1}$ is the global transition function <span v-mark.highlight.red.at="4">(macro/system level)</span>

</v-clicks>

---
transition: slide-left
---

# Mathematical Modeling

At each discrete time step $t$, the system evolves as:

$$ {hide|1|2|3|all}
\begin{aligned}
\pi^t_i &= P_i(E^t) \\
\alpha_i^t &= \delta_i(s_i^t, \pi^t_i, I),\ \text{where} \ s^t_i \in S_i\\
\langle A^{t+1}, E^{t+1} \rangle &= \gamma(\boldsymbol{\alpha}^t, E^t, I),\ \text{where}\ \boldsymbol{\alpha}^t = \{\alpha_1^t, \dots, \alpha_n^t\}
\end{aligned}
$$

<v-click at="1"><strong>1. Perception</strong>: Each agent perceives the environment</v-click><br/><br/>
<v-click at="2"><strong>2. Decision</strong>: Based on its internal state, its perception, and the set of interactions, the agent chooses and action</v-click><br/><br/>
<v-click at="3"><strong>3. Global Transition</strong>: All chosen actions, together with the environment and interactions, determine the next global system state</v-click>

---
transition: slide-left
---

# Abstract Modeling


<div class="grid grid-cols-3 mx-auto w-800px h-300px">
<div class="flex flex-col items-stretch justify-center">
$$
\forall a_i \in A
$$
<div class="bg-#f2f2f2 h-full w-full border border-black flex flex-col items-center justify-center">
<div class="bg-#f2f2f2 z-50" v-click.at="2">
Decision
</div>
</div>
</div>
<div class="flex flex-col items-center justify-between mt-52px py-12">
<div v-click.at="1">
Perception
</div>
<div v-click.at="3">
Global Transition
</div>
</div>
<div class="flex flex-col items-stretch justify-center">
$$
E
$$
<div class="bg-#f3f8f4 h-full w-full border border-black flex flex-col justify-between">
<div>
$$
\langle A^t, E^t \rangle
$$
</div>
<div class="text-xs ml-100px" v-click.at="4">
$$
t=t+1
$$  
</div>
<div v-click.at="3">
$$
\langle A^{t+1}, E^{t+1} \rangle
$$
</div>
</div>
</div>
</div>

<Arrow v-click.at="1" id="top" :x1="96 + 520" :y1="80 + 110" :x2="96 + 270" :y2="80 + 110" />
<Arrow v-click.at="2" id="left" :x2="96 + 130" :y2="80 + 280" :x1="96 + 130" :y1="80 + 110" />
<Arrow v-click.at="3" id="bottom" :x2="96 + 520" :y2="80 + 280" :x1="96 + 270" :y1="80 + 280" />
<Arrow v-click.at="4" id="right" :x1="96 + (800 / 3) * 2 + (800 / 6)" :y1="80 + 250" :x2="96 + (800 / 3) * 2 + (800 / 6)" :y2="80 + 150" />

---

# Concentration Function

<div class="grid grid-cols-2 items-center justify-center gap-4">
<div v-click>

$$
d(x, C) = \|x-C\|^2_2
$$

</div>
<div v-click.at="1">
```py
def distance(a, b):
    x1, y1 = a
    x2, y2 = b
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
```
</div>
<div v-click>

$$
\rho_B(x) = \begin{cases} 1 & \text{if } d(x, C) > r \\ 0 & \text{otherwise} \end{cases}
$$

</div>
<div v-click.at="2">
```py
def compute_rho_B(position):
    return 1 if d(position, center) <= radius else 0
```
</div>

<div v-click>

$$
\rho_A(x) = \frac{1}{1 + d(x, C)}
$$

</div>
<div v-click.at="3">

```py
def compute_rho_A(position):
    return 1 / (1 + d(position, center))
```
</div>
</div>

---

# Python Pseudo-Code

````md magic-move
```py
T = 100, n = 100, time_step = 0.1, speed = 20, size = 400
```
```py {3}
T = 100, n = 100, time_step = 0.1, speed = 20, size = 400

population = init_population(n)
```
```py {5-7}
T = 100, n = 100, time_step = 0.1, speed = 20, size = 400

population = init_population(n)

for t in range(T):
    for i in range(n):
        x, y, direction, rho = population[i]
```
```py {9-10}
T = 100, n = 100, time_step = 0.1, speed = 20, size = 400

population = init_population(n)

for t in range(T):
    for i in range(n):
        x, y, direction, rho = population[i]

        next_rho = compute_rho((x, y))
        probability = 0.9 if next_rho < rho else 0.5
```
```py {12-13}
T = 100, n = 100, time_step = 0.1, speed = 20, size = 400

population = init_population(n)

for t in range(T):
    for i in range(n):
        x, y, direction, rho = population[i]

        next_rho = compute_rho((x, y))
        probability = 0.9 if next_rho < rho else 0.5

        if random() < probability:
            direction = random(0, 2 * math.pi)

```
```py {15-16}
T = 100, n = 100, time_step = 0.1, speed = 20, size = 400

population = init_population(n)

for t in range(T):
    for i in range(n):
        x, y, direction, rho = population[i]

        next_rho = compute_rho((x, y))
        probability = 0.9 if next_rho < rho else 0.5

        if random() < probability:
            direction = random(0, 2 * math.pi)

        x = (x + cos(direction) * speed * time_step) % size
        y = (y + sin(direction) * speed * time_step) % size
```
```py {18}
T = 100, n = 100, time_step = 0.1, speed = 20, size = 400

population = init_population(n)

for t in range(T):
    for i in range(n):
        x, y, direction, rho = population[i]

        next_rho = compute_rho((x, y))
        probability = 0.9 if next_rho < rho else 0.5

        if random() < probability:
            direction = random(0, 2 * math.pi)

        x = (x + cos(direction) * speed * time_step) % size
        y = (y + sin(direction) * speed * time_step) % size

        population[i] = (x, y, direction, next_rho)
```
```py 
T = 100, n = 100, time_step = 0.1, speed = 20, size = 400

population = init_population(n)

for t in range(T):
    for i in range(n):
        x, y, direction, rho = population[i]

        next_rho = compute_rho((x, y))
        probability = 0.9 if next_rho < rho else 0.5

        if random() < probability:
            direction = random(0, 2 * math.pi)

        x = (x + cos(direction) * speed * time_step) % size
        y = (y + sin(direction) * speed * time_step) % size

        population[i] = (x, y, direction, next_rho)
```
````

---
layout: center
class: text-center
---

<div>
    <img class="mx-auto mt-10" width="80%" src="./images/qrcode.gif" alt="" />
    <a href="https://bacteria.capitainetoinon.ch/simulation" target="__blank">bacteria.capitainetoinon.ch/simulation</a>
</div>

---
routeAlias: simulation
---

<BacteriaPlot />

---
---

# Limitations

<v-clicks>

- No life cycle of agents
- Food concentration is constant
- No interactions between agents

</v-clicks>

---

# Improvements

<v-clicks>

- Better boundery conditions
- Depleating food source
- More realistic interactions between agents
- Life cycle of agents

</v-clicks>

---

# Real World Applications

<v-clicks>

- Spread of infectious diseases
- Financial markets
- Traffic flow
- etc.

</v-clicks>

---
layout: center
---

# Thank You

