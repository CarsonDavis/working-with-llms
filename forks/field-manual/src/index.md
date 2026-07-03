---
title: Working With LLMs
layout: base.njk
---
<article class="cover">
  <h1 class="cover-title">Working With LLMs</h1>

  <div class="cover-dek">

An actionable guide to doing software development with coding agents.

Modern agents write good code. The hard part is getting them to build the *right* thing, the *right* way, for *your* project.

This guide will not try to teach you everything you will ever need to know about LLMs, but it will give you a solid foundation to start from: specific recommendations for how to work and specific tools we have built that you will find useful along the way.

  </div>

  <figure class="pull cover-epigraph"><blockquote>Do not skim it.</blockquote></figure>

  <p class="cover-lead">It is short, it is concise, and it walks the whole approach end to end. If you want more detail on a particular piece, follow that section's link into its child document.</p>

  <p class="cover-cta"><a href="/chapters/01-start-here/">Begin &mdash; Chapter 1, Start Here &rarr;</a></p>

  <hr class="hairline">

  <h2 class="contents-heading">Contents</h2>
  <ol class="contents-list">
  {% for chapter in collections.chapters %}
    <li class="contents-item">
      <a href="{{ chapter.url }}">
        <span class="contents-num">{{ chapter.data.num }}</span>
        <span class="contents-text">
          <span class="contents-title">{{ chapter.data.title }}</span>
          <span class="contents-dek">{{ chapter.data.dek }}</span>
        </span>
      </a>
    </li>
  {% endfor %}
  </ol>

  <hr class="hairline">

  <p class="colophon">The universal skills and agents this guide points to live in the <a href="https://github.com/CarsonDavis/claude">claude</a> repo. Project-specific skills will be linked to in their respective docs.</p>

  <p class="last-revised">Last revised: {{ buildDate }}</p>
</article>
