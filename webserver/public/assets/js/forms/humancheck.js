export function generateHumanCheck() {
	const num1 = Math.floor(Math.random() * 10) + 1;
	const num2 = Math.floor(Math.random() * 10) + 1;
	const question = `What is ${num1} + ${num2}?`;
	const answer = num1 + num2;

	document.getElementById('humanCheckLabel').textContent = question;
	document.getElementById('humanCheckAnswer').value = answer;
}