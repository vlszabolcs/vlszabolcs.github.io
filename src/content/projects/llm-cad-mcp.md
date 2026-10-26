---
title: LLM-driven CAD with MCP
status: Learning
summary: "Learning how MCP servers let a language model drive CAD tools such as FreeCAD."
order: 3
specs:
  - { label: Protocol, value: "Model Context Protocol" }
  - { label: CAD, value: "FreeCAD, Autodesk Inventor" }
  - { label: Language, value: "Python" }
  - { label: Focus, value: "Tool design for LLMs" }
links:
  - { label: "neka-nat/freecad-mcp", url: "https://github.com/neka-nat/freecad-mcp" }
---

The Model Context Protocol lets a language model call tools through a standard interface. I'm studying freecad-mcp, an MCP server that lets an LLM create and edit FreeCAD models, to understand how such servers are built. My goal is to bring the same idea to the CAD automation I already do with iLogic and Python.
