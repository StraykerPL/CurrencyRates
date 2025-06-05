Feature: Przeglądanie kursów walut
  Aby móc śledzić aktualne kursy walut,
  jako użytkownik systemu
  chcę mieć możliwość przeglądania aktualnych kursów wymiany.

  Scenario: Wyświetlanie aktualnych kursów walut
    Given Użytkownik znajduje się na stronie głównej
    When Wybiera dzisiejszą datę
    Then Powinien zobaczyć listę aktualnych kursów walut
    And Dla każdej waluty powinien zobaczyć jej kod i średni kurs wymiany

  Scenario: Przeglądanie historycznych kursów
    Given Użytkownik znajduje się na stronie z kursami walut
    When Wybiera datę z przeszłości i przedział czasowy
    Then Powinien zobaczyć historyczne kursy walut z wybranej daty