
import React from 'react';

export const renderMarkdownContent = (text: string) => {
  return text.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2">{line.slice(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-gray-800">{line.slice(3)}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-medium mt-5 mb-2 text-gray-700">{line.slice(4)}</h3>;
    }
    if (line.startsWith('#### ')) {
      return <h4 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-700">{line.slice(5)}</h4>;
    }
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      return <p key={index} className="font-semibold text-base mt-3 mb-2 text-gray-800">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith('*') && line.endsWith('*') && !line.includes('**') && line.length > 2) {
      return <p key={index} className="font-medium text-base mt-3 mb-2 text-gray-700 italic">{line.slice(1, -1)}</p>;
    }
    if (line.startsWith('- ')) {
      return <li key={index} className="ml-6 mb-2 text-gray-700 list-disc">{line.slice(2)}</li>;
    }
    if (line.startsWith('* ')) {
      return <li key={index} className="ml-6 mb-2 text-gray-700 list-disc">{line.slice(2)}</li>;
    }
    if (line.match(/^\d+\. /)) {
      const number = line.match(/^(\d+)\. (.*)$/);
      if (number) {
        return <li key={index} className="ml-6 mb-2 text-gray-700 list-decimal">{number[2]}</li>;
      }
    }
    if (line.trim() === '') {
      return <div key={index} className="mb-3" />;
    }
    if (line.includes('**')) {
      const parts = line.split(/(\*\*[^*]+\*\*)/);
      return (
        <p key={index} className="mb-3 text-gray-700 leading-relaxed">
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIndex} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    }
    return <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>;
  });
};

export const formatRecommendationForPrint = (text: string) => {
  return text.split('\n').map((line) => {
    if (line.startsWith('# ')) {
      return `<h1>${line.slice(2)}</h1>`;
    }
    if (line.startsWith('## ')) {
      return `<h2>${line.slice(3)}</h2>`;
    }
    if (line.startsWith('### ')) {
      return `<h3>${line.slice(4)}</h3>`;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return `<h4>${line.slice(2, -2)}</h4>`;
    }
    if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
      return `<h5>${line.slice(1, -1)}</h5>`;
    }
    if (line.startsWith('- ')) {
      return `<li>${line.slice(2)}</li>`;
    }
    if (line.trim() === '') {
      return '<br>';
    }
    return `<p>${line}</p>`;
  }).join('');
};
