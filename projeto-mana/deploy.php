<?php
namespace Deployer;

require 'recipe/common.php';

// Configuration

set('repository', 'git@github.com:Casa-Publicadora-Brasileira/projeto-mana.git');

// Hosts

host('serverfrontend')
    ->user('cpb-digital')
    ->stage('producao')
    ->set('branch', 'kids-2019')
    ->set('deploy_path', '~/public_html/kids');

// Tasks

task('deploy:info', function () {
    $what = '';
    $branch = get('branch');
    if (!empty($branch)) {
        $what = "<fg=magenta>$branch</fg=magenta>";
    }
    if (input()->hasOption('tag') && !empty(input()->getOption('tag'))) {
        $tag = input()->getOption('tag');
        $what = "tag <fg=magenta>$tag</fg=magenta>";
    } elseif (input()->hasOption('revision') && !empty(input()->getOption('revision'))) {
        $revision = input()->getOption('revision');
        $what = "revision <fg=magenta>$revision</fg=magenta>";
    }
    if (empty($what)) {
        $what = "<fg=magenta>HEAD</fg=magenta>";
    }
    writeln("✈︎ Deploying $what on <fg=cyan>{{hostname}}</fg=cyan>");
});

task('deploy:currentpath', function(){
    run("rm {{deploy_path}}/current");
    run("{{bin/symlink}} {{release_path}}/web {{deploy_path}}/current");
});

// Bower
task('deploy:bower', function () {
    within('{{release_path}}/web', function () {
        run('bower install');
    });
})->desc('Initialization');

desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:symlink',
    'deploy:bower',
    'deploy:currentpath',
    'deploy:unlock',
    'cleanup',
]);

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');