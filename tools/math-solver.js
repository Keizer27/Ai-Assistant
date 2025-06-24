import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeMathSolver(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Math Solver</h2>
        </div>
        <div class="tool-content">
            <div class="math-form">
                <div class="form-group">
                    <label>Math Problem</label>
                    <textarea id="math-problem" placeholder="Enter your math problem or equation"></textarea>
                </div>
                <div class="form-group">
                    <label>Solution Type</label>
                    <select id="solution-type">
                        <option value="answer">Just the Answer</option>
                        <option value="steps">Step-by-Step Solution</option>
                        <option value="explanation">Detailed Explanation</option>
                    </select>
                </div>
                <button class="generate-btn" id="solve-math">Solve</button>
            </div>
            <div class="chat-messages" id="math-solver-messages" style="display:none;"></div>
        </div>
        <div class="tool-actions" style="display:none;" id="math-actions">
            <button class="action-btn copy-btn" id="copy-math">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-math">
                <i class="fas fa-save"></i> Save
            </button>
        </div>
    `;
    
    const solveBtn = document.getElementById('solve-math');
    const messagesContainer = document.getElementById('math-solver-messages');
    const actionsContainer = document.getElementById('math-actions');
    
    solveBtn.addEventListener('click', solveMath);
    
    async function solveMath() {
        const problem = document.getElementById('math-problem').value.trim();
        const solutionType = document.getElementById('solution-type').value;
        
        if (!problem) {
            showToast('Please enter a math problem');
            return;
        }
        
        solveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Solving...';
        
        try {
            let prompt = `Solve this math problem: ${problem}. `;
            if (solutionType === 'steps') {
                prompt += "Show each step of the solution process.";
            } else if (solutionType === 'explanation') {
                prompt += "Provide a detailed explanation of how to solve it.";
            } else {
                prompt += "Provide just the final answer.";
            }
            
            const solution = await callGoogleAI(prompt, "You are a math expert. Provide accurate solutions.");
            
            document.querySelector('.math-form').style.display = 'none';
            messagesContainer.style.display = 'block';
            actionsContainer.style.display = 'flex';
            
            addAIMessage(solution, 'math-solver-messages');
            
            document.getElementById('copy-math').addEventListener('click', () => {
                navigator.clipboard.writeText(solution);
                showToast('Solution copied to clipboard!');
            });
            
            document.getElementById('save-math').addEventListener('click', () => {
                downloadAsFile(solution, `math-solution-${problem.substring(0, 20)}.txt`);
            });
        } catch (error) {
            showToast('Failed to solve the problem');
        } finally {
            solveBtn.innerHTML = 'Solve';
        }
    }
}
