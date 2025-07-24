document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const candidatesContainer = document.getElementById('candidates');
    const filterStyle = document.getElementById('filterStyle');
    const filterWing = document.getElementById('filterWing');
    const stats = document.getElementById('stats');
  
    let candidates = JSON.parse(localStorage.getItem('candidates')) || [];
  

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const newCandidate = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          type: document.getElementById('type').value,
          style: document.getElementById('style').value.trim(),
          song: document.getElementById('song').value.trim(),
          checked: document.getElementById('checked').value
        };
  
        candidates.push(newCandidate);
        localStorage.setItem('candidates', JSON.stringify(candidates));
        form.reset();
        showSuccessMessage("המועמדות נשלחה בהצלחה!");
      });
  
      function showSuccessMessage(msg) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = msg;
        form.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
      }
    }
  
    // ----------- עמוד תצוגה ----------
    if (candidatesContainer) {
      function renderCandidates() {
        const styleFilter = filterStyle.value.trim().toLowerCase();
        const wingFilter = filterWing.value;
  
        const filtered = candidates.filter(c => {
          const matchesStyle = c.style.toLowerCase().includes(styleFilter);
          const matchesWing = wingFilter === '' || c.type === wingFilter;
          return matchesStyle && matchesWing;
        });
  
        candidatesContainer.innerHTML = filtered.length === 0
          ? '<p>אין מועמדים להצגה לפי הסינון הנוכחי.</p>'
          : filtered.map((c, i) => `
            <div class="candidate">
              <strong>${c.name}</strong> — סוג כנפיים: ${c.type}, סגנון מוזיקלי: ${c.style}, שם שיר: "${c.song}"<br>
              <span class="${c.checked === 'כן' ? 'passed' : 'not-passed'}">
                ${c.checked === 'כן' ? '✅ עבר אודישן' : '❌ לא עבר אודישן'}
              </span>
              <div class="action-buttons">
                <button class="toggle-btn" onclick="toggleChecked(${i})">שנה סטטוס</button>
                <button class="delete-btn" onclick="deleteCandidate(${i})">מחק</button>
              </div>
            </div>
          `).join('');
  
        const passedCount = filtered.filter(c => c.checked === "כן").length;
        stats.textContent = `סה"כ מועמדים: ${filtered.length} מתוך ${candidates.length} | עברו אודישן: ${passedCount}`;
      }
  
      window.deleteCandidate = function(index) {
        candidates.splice(index, 1);
        localStorage.setItem('candidates', JSON.stringify(candidates));
        renderCandidates();
      };
  
      window.toggleChecked = function(index) {
        candidates[index].checked = candidates[index].checked === "כן" ? "לא" : "כן";
        localStorage.setItem('candidates', JSON.stringify(candidates));
        renderCandidates();
      };
  
      filterStyle.addEventListener('input', renderCandidates);
      filterWing.addEventListener('change', renderCandidates);
  
      renderCandidates();
    }
  });