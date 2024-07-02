#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

const todoList = [];

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow('Welcome to the ToDo CLI!\n');
  await sleep();
  rainbowTitle.stop();
  
  console.log(
    gradient.pastel.multiline(figlet.textSync('TODO CLI', { horizontalLayout: 'full' }))
  );

  console.log(chalk.greenBright('Manage your tasks efficiently!\n'));
}

async function showMenu() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'Add a new task',
        'View all tasks',
        'Mark a task as done',
        'Delete a task',
        'Exit'
      ]
    }
  ]);

  switch (answers.action) {
    case 'Add a new task':
      await addTask();
      break;
    case 'View all tasks':
      viewTasks();
      break;
    case 'Mark a task as done':
      await markTaskAsDone();
      break;
    case 'Delete a task':
      await deleteTask();
      break;
    case 'Exit':
      console.log(chalk.blue('Goodbye!'));
      process.exit(0);
  }

  await showMenu();
}

async function addTask() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'task',
      message: 'Enter the task:'
    }
  ]);

  todoList.push({ task: answer.task, done: false });

  const spinner = createSpinner('Adding task...').start();
  await sleep(1000);
  spinner.success({ text: 'Task added!' });
}

function viewTasks() {
  console.log('\n' + chalk.yellowBright('Your Tasks:\n'));
  todoList.forEach((task, index) => {
    console.log(
      `${index + 1}. ${task.done ? chalk.strikethrough(task.task) : task.task}`
    );
  });
  console.log('\n');
}

async function markTaskAsDone() {
  const choices = todoList.map((task, index) => ({
    name: task.task,
    value: index
  }));

  if (choices.length === 0) {
    console.log(chalk.red('No tasks to mark as done.'));
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'taskIndex',
      message: 'Select a task to mark as done:',
      choices
    }
  ]);

  todoList[answer.taskIndex].done = true;

  const spinner = createSpinner('Marking task as done...').start();
  await sleep(1000);
  spinner.success({ text: 'Task marked as done!' });
}

async function deleteTask() {
  const choices = todoList.map((task, index) => ({
    name: task.task,
    value: index
  }));

  if (choices.length === 0) {
    console.log(chalk.red('No tasks to delete.'));
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'taskIndex',
      message: 'Select a task to delete:',
      choices
    }
  ]);

  todoList.splice(answer.taskIndex, 1);

  const spinner = createSpinner('Deleting task...').start();
  await sleep(1000);
  spinner.success({ text: 'Task deleted!' });
}

async function start() {
  await welcome();
  await showMenu();
}

start();
