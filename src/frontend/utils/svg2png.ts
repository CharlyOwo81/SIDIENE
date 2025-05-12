import { transform } from '@svgr/core';
import html2canvas from 'html2canvas';

export const svgToPng = async (
  svgUrl: string, 
  width: number, 
  height: number
): Promise<string> => {
  try {
    const response = await fetch(svgUrl);
    if (!response.ok) throw new Error('Error cargando SVG');
    
    const svgText = await response.text();
    
    const html = await transform(svgText, {
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
    });

    const tempDiv = document.createElement('div');
    tempDiv.style.width = `${width}px`;
    tempDiv.style.height = `${height}px`;
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv);
    document.body.removeChild(tempDiv);

    return canvas.toDataURL('image/png');
    
  } catch (error) {
    console.error('Error en svgToPng:', error);
    throw error;
  }
};