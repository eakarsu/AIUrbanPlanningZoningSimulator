import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaChartBar, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

const sectionIcons = [FaChartBar, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaShieldAlt];

const parseAIText = (text) => {
  if (!text) return [];

  const str = typeof text === 'object' ? JSON.stringify(text, null, 2) : String(text);
  const lines = str.split('\n');
  const sections = [];
  let currentSection = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect section headers: ## Header, **Header**, or lines ending with :
    const h2Match = trimmed.match(/^##\s*(.+)/);
    const boldMatch = trimmed.match(/^\*\*([^*]+)\*\*\s*:?\s*(.*)/);
    const headerColonMatch = trimmed.match(/^([A-Z][A-Za-z\s&/]+):\s*$/);

    if (h2Match) {
      currentSection = { title: h2Match[1].replace(/\*\*/g, ''), items: [] };
      sections.push(currentSection);
    } else if (boldMatch && !currentSection) {
      currentSection = { title: boldMatch[1], items: [] };
      sections.push(currentSection);
      if (boldMatch[2]) {
        currentSection.items.push({ type: 'text', content: boldMatch[2] });
      }
    } else if (headerColonMatch && !line.startsWith(' ')) {
      currentSection = { title: headerColonMatch[1], items: [] };
      sections.push(currentSection);
    } else {
      if (!currentSection) {
        currentSection = { title: 'Analysis Overview', items: [] };
        sections.push(currentSection);
      }

      // Detect bullet points
      const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
      const numberedMatch = trimmed.match(/^\d+[.)]\s+(.+)/);

      if (bulletMatch) {
        currentSection.items.push({ type: 'bullet', content: formatInlineText(bulletMatch[1]) });
      } else if (numberedMatch) {
        currentSection.items.push({ type: 'bullet', content: formatInlineText(numberedMatch[1]) });
      } else {
        currentSection.items.push({ type: 'text', content: formatInlineText(trimmed) });
      }
    }
  });

  // If no sections were created, make one from the whole text
  if (sections.length === 0 && str.trim()) {
    sections.push({ title: 'AI Analysis', items: [{ type: 'text', content: str }] });
  }

  return sections;
};

const formatInlineText = (text) => {
  // Replace **bold** with styled spans
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
};

const AIOutput = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="ai-output-loading">
        <div className="ai-output-loading-spinner" />
        <div className="ai-output-loading-text">
          Running AI Analysis<span className="ai-output-loading-dots"></span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const sections = parseAIText(analysis);

  return (
    <div className="ai-output">
      {sections.map((section, idx) => {
        const IconComponent = sectionIcons[idx % sectionIcons.length];
        return (
          <div key={idx} className="ai-section">
            <div className="ai-section-header">
              <div className="ai-section-header-icon">
                <IconComponent />
              </div>
              {section.title}
            </div>
            {section.items.map((item, iIdx) => {
              if (item.type === 'bullet') {
                return (
                  <div key={iIdx} className="ai-bullet">
                    <span className="ai-bullet-icon">&#9679;</span>
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                );
              }
              return (
                <p key={iIdx} className="ai-paragraph" dangerouslySetInnerHTML={{ __html: item.content }} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default AIOutput;
