import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(title: Text("Mon Application Flutter")),
        body: Center(child: Text("Bienvenue sur mon app !")),
      ),
    );
  }
}
Ajout du fichier main.dart
