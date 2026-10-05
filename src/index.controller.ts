import { Controller, Get, Header } from '@nestjs/common'

// page shown at the site root, so visitors find Apollo Sandbox
const homePage = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>NestJS portfolio</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #121212;
            color: #ffffff;
            font-family: sans-serif;
            font-size: 1.5rem;
        }
        a { color: #7dacf8; }
    </style>
</head>
<body>
    <h1>NestJS portfolio</h1>
    <a href="/graphql">Apollo Sandbox</a>
    <a href="https://github.com/Altair-sh/nest-js-portfolio">Source code</a>
</body>
</html>`

// route /
@Controller()
export class IndexController {
    @Get()
    @Header('Content-Type', 'text/html; charset=utf-8')
    home(): string {
        return homePage
    }
}
