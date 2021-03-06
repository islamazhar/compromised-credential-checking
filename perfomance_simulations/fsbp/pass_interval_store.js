// Generated by CoffeeScript 2.3.2
(function() {
  var NgramProb, bucket_size, converter, crypto, filename, fs, get_range, i, j, len, ngram_prob, pass_prob, pass_ran, password, passwords, prob_json, pw_json, range, rawdata, sum,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  fs = require('fs');

  NgramProb = require('/home/bijeeta/cloudfare/pwmodels/src/ngram_cs/ngram-prob');

  crypto = require('crypto');

  converter = require('hex2dec');

  bucket_size = 2 ** 40;

  filename = 'res.json';

  ngram_prob = new NgramProb(filename);

  pass_prob = {};

  get_range = function(pw) {
    var dec, hash, hex, min_gamma, prob_bucktes, prob_pq, prob_pw, res;
    prob_pw = ngram_prob.cal_prob(pw);
    pass_prob[password] = Math.log(prob_pw);
    prob_pq = ngram_prob.cal_prob_topq(1);
    prob_bucktes = Math.ceil((bucket_size * prob_pw) / prob_pq);
    min_gamma = Math.min(bucket_size, prob_bucktes);
    hash = crypto.createHash('sha1');
    hash.update(pw);
    hex = hash.digest('hex');
    
    dec = converter.hexToDec(hex.substring(0, 10));
    console.log(modulo(dec,10))
    res = [];
    res.push(modulo(dec, bucket_size));
    res.push((modulo(dec, bucket_size)) + min_gamma);
    return res;
  };

  rawdata = fs.readFileSync('/hdd/c3s/data/aws_data/breach_compilation-withoutcount_1000000.json');
  console.log("reaidng")
  passwords = JSON.parse(rawdata);
  console.log("loading")
  pass_ran = {};

  sum = 0;

  i = 0;

  for (j = 0, len = passwords.length; j < len; j++) {
    password = passwords[j];
    if (i % 100000 === 0) {
      console.log(i);
    }
    //clcconsole.log sum/i
    range = get_range(password);
    //sum = sum+(range[1]-range[0])
    pass_ran[password] = range;
    i = i + 1;
    if (i == 50){break;} 
  }

  pw_json = JSON.stringify(pass_ran);

  prob_json = JSON.stringify(pass_prob);

  //fs.writeFileSync('/hdd/c3s/data/aws_data/breach_compilation-pw_range_full.json', pw_json);

}).call(this);
