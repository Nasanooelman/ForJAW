// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"

/**
 * 
 */
class FString;
class SALAMISAM_API CPizza
{
public:
	CPizza();
	~CPizza();
	void SetBase(FString PizzaBase);
	bool AddTopping(FString Topping);
private:
	const int MAX_TOPPINGS = 4;
	// Our List of Toppings
	std::vector<FString> Toppings;
	// What Sauce base it has
	FString Base;
	// Is it Boxed
	bool BIsBoxed;
	// How Cooked is it?
	FString Cooked;
public:
	int GetToppings() { return Toppings.size(); }
	std::vector<FString> GetToppingList() { return Toppings; }
	void SetCooked(FString s) { Cooked = s; }
	FString GetCooked(void) { return Cooked; }
};
