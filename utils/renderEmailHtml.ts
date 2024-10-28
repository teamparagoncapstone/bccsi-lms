

import type {ReactElement} from 'react';
import type {ReactDOMServerReadableStream} from 'react-dom/server';

async function readStream(readableStream: ReactDOMServerReadableStream) {
  const reader = readableStream.getReader();
  const chunks: AllowSharedBufferSource[] = [];

  while (true) {
    const {value, done} = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }

  return chunks.map((chunk) => new TextDecoder('utf-8').decode(chunk)).join('');
}

export async function renderEmailHtml(component: ReactElement) {
 
  const reactDOMServer = (await import('react-dom/server')).default;

  const renderToStream =
    reactDOMServer.renderToReadableStream ||
    reactDOMServer.renderToPipeableStream;

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const readableStream = await renderToStream(component);
  const html = await readStream(readableStream);
  html
    
    .replace(/^<!DOCTYPE html>/, '')
   
    .replace(/<!-- -->/g, '');

  return `${doctype}${html}`;
}